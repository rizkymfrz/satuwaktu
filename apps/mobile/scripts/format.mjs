import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_TARGETS = ["src"];
const SKIPPED_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  ".expo",
  ".turbo",
]);
const COMPACT_KINDS = new Set(["type", "const", "export"]);

function isSourceFile(file) {
  return /\.tsx?$/.test(file) && !file.endsWith(".d.ts");
}

function topLevelKind(statement) {
  if (ts.isImportDeclaration(statement)) {
    return "import";
  }
  if (ts.isInterfaceDeclaration(statement) || ts.isEnumDeclaration(statement)) {
    return "interface";
  }
  if (ts.isTypeAliasDeclaration(statement)) {
    return "type";
  }
  if (ts.isVariableStatement(statement)) {
    return "const";
  }
  if (ts.isFunctionDeclaration(statement)) {
    return statement.body ? "function" : "other";
  }
  if (ts.isClassDeclaration(statement)) {
    return "class";
  }
  if (ts.isExportDeclaration(statement)) {
    return "export";
  }
  return "other";
}

function compare(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] < right[index]) {
      return -1;
    }
    if (left[index] > right[index]) {
      return 1;
    }
  }
  return 0;
}

function importSortKey(declaration) {
  const specifier = declaration.moduleSpecifier.text;
  if (specifier.startsWith(".")) {
    throw new Error(
      `relative import "${specifier}" is not supported, use the @/ alias`,
    );
  }
  const group = specifier.startsWith("@/")
    ? 2
    : specifier.startsWith("@repo/")
      ? 1
      : 0;
  return [group, specifier.replace(/^@/, "").toLowerCase()];
}

function specifierKey(element) {
  return [
    element.isTypeOnly ? 1 : 0,
    (element.propertyName ?? element.name).text.toLowerCase(),
  ];
}

function renderImport(declaration, source, sourceFile) {
  const bindings = declaration.importClause?.namedBindings;
  const start = declaration.getStart(sourceFile);
  const original = source.slice(start, declaration.getEnd());
  if (
    !bindings ||
    !ts.isNamedImports(bindings) ||
    bindings.elements.length < 2
  ) {
    return original;
  }
  const sorted = [...bindings.elements].sort((left, right) =>
    compare(specifierKey(left), specifierKey(right)),
  );
  if (sorted.every((element, index) => element === bindings.elements[index])) {
    return original;
  }
  const names = sorted.map((element) => element.getText(sourceFile));
  const from = bindings.getStart(sourceFile) - start;
  const to = bindings.getEnd() - start;
  return `${original.slice(0, from)}{ ${names.join(", ")} }${original.slice(to)}`;
}

function importEdit(source, sourceFile) {
  const imports = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      break;
    }
    imports.push(statement);
  }
  if (imports.length === 0) {
    return null;
  }
  for (let index = 1; index < imports.length; index += 1) {
    const between = source.slice(
      imports[index - 1].getEnd(),
      imports[index].getStart(sourceFile),
    );
    if (between.trim() !== "") {
      return null;
    }
  }
  const runs = [];
  let current = [];
  for (const declaration of imports) {
    if (declaration.importClause) {
      current.push(declaration);
      continue;
    }
    runs.push(current, [declaration]);
    current = [];
  }
  runs.push(current);
  const lines = runs.flatMap((run) =>
    [...run]
      .sort((left, right) => compare(importSortKey(left), importSortKey(right)))
      .map((declaration) => renderImport(declaration, source, sourceFile)),
  );
  const start = imports[0].getStart(sourceFile);
  const end = imports[imports.length - 1].getEnd();
  const text = lines.join("\n");
  return source.slice(start, end) === text ? null : { start, end, text };
}

function exportSpecifierKey(element) {
  return [element.isTypeOnly ? 1 : 0, element.name.text.toLowerCase()];
}

function exportEdits(source, sourceFile) {
  const edits = [];
  for (const statement of sourceFile.statements) {
    const clause = ts.isExportDeclaration(statement)
      ? statement.exportClause
      : undefined;
    if (!clause || !ts.isNamedExports(clause) || clause.elements.length < 2) {
      continue;
    }
    const sorted = [...clause.elements].sort((left, right) =>
      compare(exportSpecifierKey(left), exportSpecifierKey(right)),
    );
    if (sorted.every((element, index) => element === clause.elements[index])) {
      continue;
    }
    const names = sorted.map((element) => element.getText(sourceFile));
    edits.push({
      start: clause.getStart(sourceFile),
      end: clause.getEnd(),
      text: `{ ${names.join(", ")} }`,
    });
  }
  return edits;
}

function wantsBlankTopLevel(previous, next, isSingleLine) {
  const left = topLevelKind(previous);
  const right = topLevelKind(next);
  if (left === "other" || right === "other") {
    return null;
  }
  if (left === "import" && right === "import") {
    return false;
  }
  const compact =
    left === right &&
    COMPACT_KINDS.has(left) &&
    isSingleLine(previous) &&
    isSingleLine(next);
  return !compact;
}

function jsxEdits(source, node) {
  const edits = [];
  for (const child of node.children) {
    if (!ts.isJsxText(child) || !child.containsOnlyTriviaWhiteSpaces) {
      continue;
    }
    const text = source.slice(child.pos, child.end);
    if (!/\n[ \t]*\r?\n/.test(text)) {
      continue;
    }
    edits.push({
      start: child.pos,
      end: child.end,
      text: `\n${text.slice(text.lastIndexOf("\n") + 1)}`,
      blank: false,
    });
  }
  return edits;
}

function spacingEdits(source, sourceFile) {
  const edits = [];
  const lineOf = (position) =>
    sourceFile.getLineAndCharacterOfPosition(position).line;
  const isSingleLine = (node) =>
    lineOf(node.getStart(sourceFile)) === lineOf(node.getEnd());
  const adjust = (previous, next, wantsBlank) => {
    if (wantsBlank === null) {
      return;
    }
    const start = previous.getEnd();
    const end = next.getStart(sourceFile);
    const gap = source.slice(start, end);
    if (gap.trim() !== "" || !gap.includes("\n")) {
      return;
    }
    const hasBlank = /\n[ \t]*\r?\n/.test(gap);
    if (hasBlank === wantsBlank) {
      return;
    }
    const indent = gap.slice(gap.lastIndexOf("\n") + 1);
    edits.push({
      start,
      end,
      text: `${wantsBlank ? "\n\n" : "\n"}${indent}`,
      blank: wantsBlank,
    });
  };
  const pairs = (list, wantsBlank) => {
    for (let index = 1; index < list.length; index += 1) {
      adjust(
        list[index - 1],
        list[index],
        wantsBlank(list[index - 1], list[index]),
      );
    }
  };
  pairs(sourceFile.statements, (previous, next) =>
    wantsBlankTopLevel(previous, next, isSingleLine),
  );
  const visit = (node) => {
    if (ts.isBlock(node)) {
      pairs(node.statements, () => false);
    }
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      edits.push(...jsxEdits(source, node));
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return edits;
}

function isDirectiveComment(text) {
  return /^(?:\/\/\/|\/\/\s*(?:@ts-|eslint-|prettier-ignore)|\/\*\s*(?:@ts-|eslint-|prettier-ignore))/.test(
    text,
  );
}

function jsxBoundaries(sourceFile) {
  const noTrailing = new Set();
  const visit = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const opening = ts.isJsxElement(node)
        ? node.openingElement
        : node.openingFragment;
      noTrailing.add(opening.getEnd());
      for (const child of node.children) {
        noTrailing.add(child.getEnd());
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return noTrailing;
}

function commentEdits(source, sourceFile) {
  const noTrailing = jsxBoundaries(sourceFile);
  const ranges = new Map();
  const keep = (range) => {
    const text = source.slice(range.pos, range.end);
    if (
      range.kind === ts.SyntaxKind.SingleLineCommentTrivia &&
      !isDirectiveComment(text)
    ) {
      ranges.set(range.pos, { start: range.pos, end: range.end });
    }
  };
  const visit = (node) => {
    if (
      ts.isJsxExpression(node) &&
      !node.expression &&
      /\/\*|\/\//.test(
        source.slice(node.getStart(sourceFile), node.getEnd()),
      ) &&
      !isDirectiveComment(
        source.slice(node.getStart(sourceFile) + 1, node.getEnd() - 1).trim(),
      )
    ) {
      ranges.set(node.getStart(sourceFile), {
        start: node.getStart(sourceFile),
        end: node.getEnd(),
      });
      return;
    }
    const skipped =
      ts.isJsxText(node) ||
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node);
    if (!skipped) {
      (ts.getLeadingCommentRanges(source, node.getFullStart()) ?? []).forEach(
        keep,
      );
      if (!noTrailing.has(node.getEnd())) {
        (ts.getTrailingCommentRanges(source, node.getEnd()) ?? []).forEach(
          keep,
        );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return [...ranges.values()].map(({ start, end }) => {
    const lineStart = source.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = source.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? source.length : lineEndIndex;
    const before = source.slice(lineStart, start);
    const after = source.slice(end, lineEnd);
    if (before.trim() === "" && after.trim() === "") {
      return {
        start: lineStart,
        end: Math.min(lineEnd + 1, source.length),
        text: "",
      };
    }
    return {
      start: start - (before.length - before.trimEnd().length),
      end,
      text: "",
    };
  });
}

function stripComments(source, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const edits = commentEdits(source, sourceFile);
  return { text: applyEdits(source, edits), removed: edits.length };
}

function applyEdits(source, edits) {
  return [...edits]
    .sort((left, right) => right.start - left.start)
    .reduce(
      (text, edit) =>
        text.slice(0, edit.start) + edit.text + text.slice(edit.end),
      source,
    );
}

function applyStyle(source, fileName) {
  const parse = (text) =>
    ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
  const parsed = parse(source);
  const spacing = spacingEdits(source, parsed);
  const exportSorts = exportEdits(source, parsed);
  const spaced = applyEdits(source, [...spacing, ...exportSorts]);
  const sorted = importEdit(spaced, parse(spaced));
  const text = sorted ? applyEdits(spaced, [sorted]) : spaced;
  return {
    text,
    added: spacing.filter((edit) => edit.blank).length,
    removed: spacing.filter((edit) => !edit.blank).length,
    importsChanged: sorted !== null,
    exportsChanged: exportSorts.length > 0,
  };
}

async function formatSource(source, file) {
  const options = { ...(await prettier.resolveConfig(file)), filepath: file };
  const first = await prettier.format(source, options);
  const stripped = stripComments(first, file);
  const styled = applyStyle(stripped.text, file);
  const text = await prettier.format(styled.text, options);
  const again = applyStyle(stripComments(text, file).text, file);
  return {
    ...styled,
    commentsRemoved: stripped.removed,
    text,
    stable: again.text === text,
  };
}

async function collect(target) {
  const info = await stat(target);
  if (info.isFile()) {
    return isSourceFile(target) ? [target] : [];
  }
  const entries = await readdir(target, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !SKIPPED_DIRECTORIES.has(entry.name))
      .map((entry) => collect(path.join(target, entry.name))),
  );
  return nested.flat();
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const targets = args.filter((arg) => !arg.startsWith("--"));
  const resolved = (targets.length > 0 ? targets : DEFAULT_TARGETS).map(
    (target) => path.resolve(targets.length > 0 ? process.cwd() : ROOT, target),
  );
  const files = (await Promise.all(resolved.map(collect))).flat().sort();
  const changed = [];
  const unstable = [];
  const failed = [];
  let added = 0;
  let removed = 0;
  let reordered = 0;
  let exportsSorted = 0;
  let commentsRemoved = 0;
  for (const file of files) {
    const label = path.relative(ROOT, file).replaceAll("\\", "/");
    const source = await readFile(file, "utf8");
    let result;
    try {
      result = await formatSource(source, file);
    } catch (error) {
      failed.push(`${label}: ${error.message}`);
      continue;
    }
    if (!result.stable) {
      unstable.push(label);
    }
    if (result.text === source) {
      continue;
    }
    changed.push(file);
    added += result.added;
    removed += result.removed;
    reordered += result.importsChanged ? 1 : 0;
    exportsSorted += result.exportsChanged ? 1 : 0;
    commentsRemoved += result.commentsRemoved;
    if (write) {
      await writeFile(file, result.text);
    }
    const notes = [
      `+${result.added} -${result.removed} blank`,
      result.importsChanged ? "imports" : null,
      result.exportsChanged ? "exports" : null,
      result.commentsRemoved > 0 ? `${result.commentsRemoved} comments` : null,
    ].filter(Boolean);
    console.log(
      `${write ? "formatted" : "would change"} ${label}  ${notes.join(", ")}`,
    );
  }
  console.log(
    `\n${files.length} files checked, ${changed.length} ${write ? "formatted" : "need formatting"}` +
      ` (blank lines +${added} -${removed}, imports reordered in ${reordered}, exports reordered in ${exportsSorted}, comments removed ${commentsRemoved})`,
  );
  for (const label of unstable) {
    console.log(`not stable after formatting: ${label}`);
  }
  for (const message of failed) {
    console.log(`failed: ${message}`);
  }
  if (
    unstable.length > 0 ||
    failed.length > 0 ||
    (!write && changed.length > 0)
  ) {
    process.exitCode = 1;
  }
}

await main();

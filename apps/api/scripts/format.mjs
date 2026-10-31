import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_TARGETS = ['src', 'test'];
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', '.turbo']);
const TEST_CALLS = new Set([
  'describe',
  'it',
  'test',
  'beforeEach',
  'afterEach',
  'beforeAll',
  'afterAll',
]);

function rootIdentifier(expression) {
  let current = expression;
  while (
    ts.isCallExpression(current) ||
    ts.isPropertyAccessExpression(current) ||
    ts.isElementAccessExpression(current)
  ) {
    current = current.expression;
  }
  return ts.isIdentifier(current) ? current.text : null;
}

function isTestCall(statement) {
  return (
    ts.isExpressionStatement(statement) &&
    ts.isCallExpression(statement.expression) &&
    TEST_CALLS.has(rootIdentifier(statement.expression))
  );
}

function isFunctionLike(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  );
}

function topLevelKind(statement) {
  if (ts.isImportDeclaration(statement)) {
    return 'import';
  }
  if (ts.isInterfaceDeclaration(statement) || ts.isEnumDeclaration(statement)) {
    return 'interface';
  }
  if (ts.isTypeAliasDeclaration(statement)) {
    return 'type';
  }
  if (ts.isVariableStatement(statement)) {
    return 'const';
  }
  if (ts.isFunctionDeclaration(statement)) {
    return statement.body ? 'function' : 'other';
  }
  if (ts.isClassDeclaration(statement)) {
    return 'class';
  }
  if (isTestCall(statement)) {
    return 'test';
  }
  return 'other';
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
  const typeFirst = declaration.importClause?.isTypeOnly ? 0 : 1;
  if (specifier.startsWith('.')) {
    const parents = specifier.match(/^(\.\.\/)*/)[0].length / 3;
    return [2, -parents, specifier.toLowerCase(), typeFirst];
  }
  const group = specifier.startsWith('@repo/') ? 1 : 0;
  return [group, 0, specifier.replace(/^@/, '').toLowerCase(), typeFirst];
}

function specifierName(element) {
  return (element.propertyName ?? element.name).text.toLowerCase();
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
  const sorted = [...bindings.elements].sort((left, right) => {
    const a = specifierName(left);
    const b = specifierName(right);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  if (sorted.every((element, index) => element === bindings.elements[index])) {
    return original;
  }
  const names = sorted.map((element) => element.getText(sourceFile));
  const from = bindings.getStart(sourceFile) - start;
  const to = bindings.getEnd() - start;
  return `${original.slice(0, from)}{ ${names.join(', ')} }${original.slice(to)}`;
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
    if (between.trim() !== '') {
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
  const text = lines.join('\n');
  return source.slice(start, end) === text ? null : { start, end, text };
}

function wantsBlankTopLevel(previous, next, isSingleLine) {
  const left = topLevelKind(previous);
  const right = topLevelKind(next);
  if (left === 'other' || right === 'other') {
    return null;
  }
  if (left === 'import' && right === 'import') {
    return false;
  }
  const compact =
    left === right &&
    (left === 'type' || left === 'const') &&
    isSingleLine(previous) &&
    isSingleLine(next);
  return !compact;
}

function wantsBlankMember(previous, next) {
  if (ts.isPropertyDeclaration(previous) && ts.isPropertyDeclaration(next)) {
    const decorated = (member) => (ts.getDecorators(member)?.length ?? 0) > 0;
    return decorated(previous) || decorated(next) ? null : false;
  }
  return true;
}

function wantsBlankInBlock(block, previous, next) {
  const suite =
    isFunctionLike(block.parent) && block.statements.some(isTestCall);
  return suite ? isTestCall(previous) || isTestCall(next) : false;
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
    if (gap.trim() !== '' || !gap.includes('\n')) {
      return;
    }
    const hasBlank = /\n[ \t]*\r?\n/.test(gap);
    if (hasBlank === wantsBlank) {
      return;
    }
    const indent = gap.slice(gap.lastIndexOf('\n') + 1);
    edits.push({
      start,
      end,
      text: `${wantsBlank ? '\n\n' : '\n'}${indent}`,
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
      pairs(node.statements, (previous, next) =>
        wantsBlankInBlock(node, previous, next),
      );
    }
    if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      pairs(node.members, wantsBlankMember);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return edits;
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
  const spacing = spacingEdits(source, parse(source));
  const spaced = applyEdits(source, spacing);
  const sorted = importEdit(spaced, parse(spaced));
  const text = sorted ? applyEdits(spaced, [sorted]) : spaced;
  return {
    text,
    added: spacing.filter((edit) => edit.blank).length,
    removed: spacing.filter((edit) => !edit.blank).length,
    importsChanged: sorted !== null,
  };
}

async function formatSource(source, file) {
  const options = { ...(await prettier.resolveConfig(file)), filepath: file };
  const first = await prettier.format(source, options);
  const styled = applyStyle(first, file);
  const text = await prettier.format(styled.text, options);
  const again = applyStyle(text, file);
  return { ...styled, text, stable: again.text === text };
}

async function collect(target) {
  const info = await stat(target);
  if (info.isFile()) {
    return target.endsWith('.ts') ? [target] : [];
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
  const write = args.includes('--write');
  const targets = args.filter((arg) => !arg.startsWith('--'));
  const resolved = (targets.length > 0 ? targets : DEFAULT_TARGETS).map(
    (target) => path.resolve(targets.length > 0 ? process.cwd() : ROOT, target),
  );
  const files = (await Promise.all(resolved.map(collect))).flat().sort();
  const changed = [];
  const unstable = [];
  let added = 0;
  let removed = 0;
  let reordered = 0;
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const result = await formatSource(source, file);
    if (!result.stable) {
      unstable.push(file);
    }
    if (result.text === source) {
      continue;
    }
    changed.push(file);
    added += result.added;
    removed += result.removed;
    reordered += result.importsChanged ? 1 : 0;
    if (write) {
      await writeFile(file, result.text);
    }
    const label = path.relative(ROOT, file).replaceAll('\\', '/');
    const notes = [
      `+${result.added} -${result.removed} blank`,
      result.importsChanged ? 'imports' : null,
    ].filter(Boolean);
    console.log(
      `${write ? 'formatted' : 'would change'} ${label}  ${notes.join(', ')}`,
    );
  }
  console.log(
    `\n${files.length} files checked, ${changed.length} ${write ? 'formatted' : 'need formatting'}` +
      ` (blank lines +${added} -${removed}, imports reordered in ${reordered})`,
  );
  for (const file of unstable) {
    console.log(`not stable after formatting: ${path.relative(ROOT, file)}`);
  }
  if (unstable.length > 0 || (!write && changed.length > 0)) {
    process.exitCode = 1;
  }
}

await main();

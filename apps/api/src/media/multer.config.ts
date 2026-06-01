import { existsSync, mkdirSync } from "fs";
import { extname, join } from "path";
import { diskStorage } from "multer";

const UPLOADS_DIR = join(process.cwd(), "uploads");

export const multerConfig = {
  storage: diskStorage({
    destination: (
      _req: unknown,
      _file: Express.Multer.File,
      cb: (err: Error | null, dest: string) => void,
    ) => {
      if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
      cb(null, UPLOADS_DIR);
    },
    filename: (
      _req: unknown,
      file: Express.Multer.File,
      cb: (err: Error | null, name: string) => void,
    ) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (err: Error | null, accept: boolean) => void,
  ) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const ok =
      allowed.test(extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("File type tidak diizinkan"), false);
  },
};

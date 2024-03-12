import multer from "multer";
import * as path from "node:path";
import * as crypto from "node:crypto";

const multerConfig = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename: (req, file, cb) => {
    const prefix = crypto.randomUUID();
    cb(null, `${prefix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: multerConfig,
});

export default upload;

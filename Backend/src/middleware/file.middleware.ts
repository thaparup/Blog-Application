import type { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, callback) {
    callback(null, "./public/temp/");
  },
  filename(req: Request, file: Express.Multer.File, callback) {
    const fileName = file.originalname.split(".");
    const ext = fileName[fileName.length - 1];
    callback(
      null,
      `file.originalname-${Math.round(Math.random() * 81837234)}.${ext}`
    );
  },
});

const uploadImage = () => {
  return multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter(req: Request, file: Express.Multer.File, callback) {
      const ext = file?.originalname?.split(".").pop()?.toLowerCase();

      if (ext && ["jpg", "jpeg", "png"].includes(ext)) {
        callback(null, true);
      } else {
        callback(null, false);
        throw new Error("Only image files are allowed!");
      }
    },
  });
};

export { uploadImage };

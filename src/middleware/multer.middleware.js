import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/temp");
  },
  filename(req, file, cb) {
    const extName = file.originalname.split(".").pop(); // this will pop up only extension of file eg=> .jpeg, .png etc.
    cb(null, `${uuid()}.${extName}`);
  },
});

export const upload = multer({
  storage,
}).single("photo");

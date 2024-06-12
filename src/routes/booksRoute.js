import express from "express";
import  isAdmin  from "../middleware/isAdmin.middleware.js";
import authenticateHandler from "../utils/authenticateHandler.js"
import { category, changedCoverPic, delBook, filter, getAllBooks, singleBook, updateBookDetails, uploadBooks } from "../controllers/book.controller.js";
import {upload} from "../middleware/multer.middleware.js"
const router = express.Router();

router.get("/all-books",getAllBooks)
router.get("/categories",category)
router.get("/filter",filter)
router.post("/upload-book",authenticateHandler,isAdmin,upload,uploadBooks)
router.patch("/chng-cover/:id",authenticateHandler,isAdmin,upload,changedCoverPic) // Change Cover Pic
router.put("/book-upd/:id",authenticateHandler,isAdmin,updateBookDetails) //Update book detail
router.delete("/book-del/:id",authenticateHandler,isAdmin,delBook)
router.get("/:id",singleBook);

export default router;

import express from "express";
import { changePassword, changedAccountDetails, changedProfilePic, getSingleUserDataById, loginUser, logoutHandler, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticateHandler from "../utils/authenticateHandler.js";

const router = express.Router();

router.post("/new",upload,registerUser)
router.post("/sign-in",loginUser)
router.get("/logout",authenticateHandler,logoutHandler)
router.post("/refreshAccessToken",refreshAccessToken)
router.patch("/psswd-chngd",authenticateHandler,changePassword);
router.patch("/profilepic-chngd",authenticateHandler,upload,changedProfilePic)
router.put("/account-chngd",authenticateHandler,changedAccountDetails)
router.get("/data",authenticateHandler,getSingleUserDataById)
export default router;

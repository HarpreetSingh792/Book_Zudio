import express from "express";
import authenticateHandler from "../utils/authenticateHandler.js";
import { showAll, toggleList } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authenticateHandler);


router.post("/toggle-list/:id",toggleList);
router.get("/all",showAll)



export default router;

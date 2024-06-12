import express from "express";
import authenticateHandler from "../utils/authenticateHandler.js"
import { addReview, allReviews, delReview, dislikedReview, likedReview, updateReview, userReview } from "../controllers/review.controller.js";


const router = express.Router();

// Available to all the users even they are not logged in or guest....
router.get("/all/:id",allReviews)

router.use(authenticateHandler)  // Using authentication middleware with all the routes.....

// Only Logged In user can have the acess to this....

router.post("/add-rev/:id",addReview)
router.delete("/del-rev/:id",delReview)
router.patch("/upd-rev/:id",updateReview)
router.get("/my-rev/:id",userReview)
router.patch("/like/:id",likedReview)
router.patch("/dislike/:id",dislikedReview)



export default router;

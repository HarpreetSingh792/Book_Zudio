import { Review } from "../models/review.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";

export const addReview = asyncHandler(async (req, res, next) => {
  const { _id } = req.user.access;
  const { id } = req.params;
  const review = req.body.review;

  await Review.create({
    user: _id,
    book: id,
    review,
  });

  res.status(201).json({
    success: true,
    message: "Review Added Successfully",
  });
});

export const allReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const reviews = await Review.aggregate([
    {
      $match: {
        book: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      }, 
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        likes: 1,
        dislikes: 1,
        review: 1,
        book: 1,
        user: {
          email: 1,
          photo: 1,
          name: 1,
        },
      },
    },
  ]);

  if (!reviews)
    return next(new ErrorHandler(404, "Be one to add first review"));
  res.status(200).json({
    success: true,
    reviews,
  });
});

export const userReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user.access;

  const reviews = await Review.aggregate([
    {
      $match: {
        book: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $match: {
        user: new mongoose.Types.ObjectId(_id),
      },
    },
  ]);

  if (!reviews) return next(new ErrorHandler(404, "No reviews addded yet!!!"));

  res.status(200).json({
    success: true,
    reviews,
  });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { review } = req.body;

  const userReview = await Review.findById(id);
  if (!userReview)
    return next(new ErrorHandler(404, "Review not found or deleted"));

  userReview.review = review;
  await userReview.save();
  res.status(200).json({
    success: true,
    message: "Review Updated Successfully!!!",
    edited: true,
  });
});

export const likedReview = asyncHandler(async (req, res, next) => {
  const { toggle } = req.query;
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review)
    return next(new ErrorHandler(404, "Review not found or deleted"));

  if (toggle) {
    if (review.likes !== 0) review.likes -= 1;
  } else {
    review.likes += 1;
  }
  await review.save();
  res.status(200).json({
    success: true,
    likes: review.likes,
  });
});
export const dislikedReview = asyncHandler(async (req, res, next) => {
  const { toggle } = req.query;
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review)
    return next(new ErrorHandler(404, "Review not found or deleted"));
  if (toggle) {
    if (review.dislikes !== 0) review.dislikes -= 1;
  } else {
    review.dislikes += 1;
  }
  await review.save();
  res.status(200).json({
    success: true,
    dislikes: review.dislikes,
  });
});

export const delReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Review Deleted Successfully!",
  });
});

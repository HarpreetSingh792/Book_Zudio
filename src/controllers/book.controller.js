import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Books } from "../models/books.js";
import { rm } from "fs";

export const uploadBooks = asyncHandler(async (req, res, next) => {
  const {
    author,
    title,
    keywords,
    description,
    price,
    category,
    available,
    isbn,
  } = req.body;
  const photo = req.file;
  if (!photo) next(new ErrorHandler(400, "Please add cover photo"));
  if (
    !author |
    !title |
    !keywords |
    !description |
    !price |
    !category |
    !available |
    !isbn
  ) {
    rm(photo?.path, () => {
      console.log(`Deleted photo ${photo?.path}`);
    });
    next(new ErrorHandler(400, "Please fill all the fields"));
  }

  await Books.create({
    author: author.toLowerCase(),
    title: title.toLowerCase(),
    keywords: keywords.split(","),
    description,
    price,
    category,
    available: available.split(","),
    photo: photo?.path,
    isbn: isbn.replace("-",""),
  });

  res.status(201).json({
    success: true,
    message: "Book uploaded successfully",
  });
});

export const getAllBooks = asyncHandler(async (req, res, next) => {
  const books = await Books.find({});
  res.status(200).json({
    success: true,
    books,
  });
});

export const changedCoverPic = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;
  if (!photo) next(new ErrorHandler(404, "Please add photo"));
  const book = await Books.findById(id);
  if (!book) {
    rm(photo?.path, () => {
      console.log(`Deleted cover pic ${photo?.path}`);
    });
    next(new ErrorHandler(404, "No book found"));
  }

  if (book.photo) {
    rm(book.photo, () => {
      console.log(`Deleted cover pic ${book.photo}`);
    });
  }

  book.photo = photo.path;
  await book.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Book Cover Pic Changed",
  });
});

export const updateBookDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    author,
    title,
    keywords,
    description,
    price,
    category,
    available,
    isbn,
  } = req.body;
  const book = await Books.findById(id);
  if (!book) next(new ErrorHandler(404, "No book found"));
  if (author) book.author = author;
  if (title) book.title = title;
  if (keywords) book.keywords = keywords;
  if (description) book.description = description;
  if (price) book.price = price;
  if (category) book.category = category;
  if (available) book.available = available;
  if (isbn) book.isbn = isbn;

  await book.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Book details updated successfully",
  });
});

export const singleBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const book = await Books.findById(id);

  if (!book) return next(new ErrorHandler(404, "Book not found"));

  res.status(200).json({
    success: true,
    book,
  });
});

export const category = asyncHandler(async (req, res, next) => {
  const categories = await Books.distinct("category");

  if (categories.length === 0)
    next(
      new ErrorHandler(404, "Empty Category. Please add books with category!")
    );

  res.status(200).json({
    success: true,
    categories,
  });
});

export const filter = asyncHandler(async (req, res, next) => {
  const { author, title, isbn, sort, price, category } = req.query;
  const page = 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  const searchQuery = {};

  if (author) {
    searchQuery.author = {
      $regex: author,
      $options: "i",
    };
  }

  if (title) {
    searchQuery.title = {
      $regex: title,
      $options: "i",
    };
  }

  if (price) {
    searchQuery.price = {
      $lte: price,
    };
  }

  if (isbn) {
    searchQuery.isbn = {
      $regex: isbn,
      $options: "i",
    };
  }

  if (category) {
    searchQuery.category = {
      $regex: category,
    };
  }

  const book = await Books.find(searchQuery).sort(
    sort && { price: sort === "asc" ? 1 : -1 }
  ).limit(limit).skip(skip);

  const totalPage = Math.ceil(book.length/limit);
  res.status(200).json({
    success: true,
    book,
    totalPage
  });

});

export const delBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await Books.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Book deleted Successfully",
  });
});

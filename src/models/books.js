import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    author: {
      type: String,
      required: [true, "Please enter the author name"],
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter the title"],
    },
    photo: [
      {
        public_id: {
          type: String,
          required: [true, "Book public_id must be exist"],
        },
        url:{
            type:String,
            require:[true,"Book must have a valid url"]
        }
      },
    ],
    keywords: {
      type: [String],
    },
    description: {
      type: String,
      required: [true, "Please add the description"],
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please enter the book category"],
    },
    available: {
      type: Array(String) || [String],
      enum: ["BN Exclusive", "Paper Back", "Large Print"],
      required: [
        true,
        "Please tell select all the options in which your book is available to deliver!!! ",
      ],
    },
  },
  { timestamps: true }
);

export const Books = mongoose.model("Books", bookSchema);

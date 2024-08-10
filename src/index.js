import express from "express";
import { config } from "dotenv";
import connect_DB from "./db/connect_DB.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// importing router paths....
import userRoute from "./routes/userRoute.js";
import booksRoute from "./routes/booksRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";

// importing some other middlewares....
import { errorMiddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

// Configuring the path of all env files for many .env file use path:[]
config({
  path: "./.env",
});

// creatirg an app port
const PORT = process.env.PORT || 4000;

// Initialising the express app
const app = express();

// Middlewares..............
app.use(express.json());
app.use("/public/temp/", express.static("public/temp"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({}));

// Router middleware ......
app.use("/api/v1/user/", userRoute);
app.use("/api/v1/book/", booksRoute);
app.use("/api/v1/review/", reviewRoute);
app.use("/api/v1/wishlist/", wishlistRoute);

// error Middleware......
app.use(errorMiddleware);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// connecting to the database.....
connect_DB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on a Port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(
      `Error to establish server connection something in app went wrong. Error: ${err}`
    )
  );

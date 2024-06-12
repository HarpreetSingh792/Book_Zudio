import asyncHandler from "../utils/asyncHandler.js";
import { rm } from "fs";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, gender, dob, password } = req.body;
  const photo = req.file;
  if (!photo) next(new ErrorHandler(404, "Please add photo"));
  if (!name || !email || !gender || !dob || !password) {
    rm(photo?.path, () => console.log(`Deleted ${photo?.path}`));
    return next(new ErrorHandler(404, "Please add the required fields"));
  }

  const user = await User.findOne({ email });
  if (user) {
    rm(photo?.path, () => console.log(`Deleted ${photo?.path}`));
    return next(new ErrorHandler(409, "User Already Exist"));
  }
  await User.create({
    name: name.toLowerCase(),
    email,
    password,
    gender,
    dob,
    photo: photo?.path,
  });
  return res.status(201).json({
    success: true,
    message: "User Created Successfully!!!",
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) next(new ErrorHandler(404, "Please register first!!!"));
  const validPass = await user.isPasswordCorrect(password);
  if (!validPass) next(new ErrorHandler(401, "Invalid credentials"));
  const accessToken = await user.generateJwtToken(true);
  const refreshToken = await user.generateJwtToken(false);
  user.refreshToken = refreshToken.toString();
  await user.save({ validateBeforeSave: false });
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 1000 * 60 * 24,
    secure: true,
    sameSite: "lax",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 1000 * 60 * 24 * 15,
    })
    .json({
      success: true,
      message: `Welcome Back ${user.name}`,
    });
});

export const logoutHandler = asyncHandler(async (req, res, next) => {
  const { _id } = req.user.access;

  await User.findByIdAndUpdate(
    _id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });
});

/* To refresh the accessToken since it is a short term token so it can expire shortly and here comes the idea that 
we can regenerate the token without letting the user to login again */
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { _id } = jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET);

  const user = await User.findById(_id);

  if (!user) next(new ErrorHandler(401, "Unauthorizes access "));

  const UserToken = jwt.verify(user.refreshToken, process.env.JWT_SECRET);

  if (UserToken._id !== _id)
    next(new ErrorHandler(401, "Refresh Token expired and used"));

  const accessToken = await user.generateJwtToken(true);
  const refreshToken = await user.generateJwtToken(false);
  user.refreshToken = refreshToken.toString();
  await user.save({ validateBeforeSave: false });
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 1000 * 60 * 24,
    secure: true,
    sameSite: "lax",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 1000 * 60 * 24 * 15,
    })
    .json({
      success: true,
      message: `Welcome Back ${user.name}`,
    });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if(!oldPassword|!newPassword) next(new ErrorHandler(404,"Please add the required field"))
  const user = await User.findById(req.user.access._id);
  if (!(await user.isPasswordCorrect(oldPassword)))
    next(new ErrorHandler(401, "Password is incorrect"));

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password changed successfuly",
  });
});

export const changedProfilePic = asyncHandler(async (req, res, next) => {
  const photo = req.file;
  if(!photo) next(new ErrorHandler(404,"Please add, photo"))
  const { _id } = req.user.access;
  const user = await User.findById(_id);
  if (!user) {
    rm(photo?.path, () => {
      console.log(`Deleted photo: ${photo?.path}`);
    });
    next(new ErrorHandler(401, "unauthorised access"));
  }

  rm(user.photo, () => {
    console.log(`Deleted photo: ${user?.photo}`);
  });

  user.photo = photo?.path;
  await user.save({validateBeforeSave:false});

  return res.status(201).json({
    success:true,
    messsage:"Profile Pic changed successfully!!"
  })
});


export const changedAccountDetails=asyncHandler(async(req,res,next)=>{
  const {_id} = req.user.access;
  const {name,dob,gender}= req.body;
  const user = await User.findById(_id);
  if(!user) next(new ErrorHandler(400,"Something Went Wrong"))
  if(name){
    user.name=name.toLowerCase();
  }
  if(dob){
    user.dob=dob;
  }
  if(gender){
    user.gender=gender
  }

  await user.save({validateBeforeSave:false});

  res.status(200).json({
    success:true,
    message:"Account Updated!"
  })
})

export const getSingleUserDataById=asyncHandler(async(req,res,next)=>{
  const {_id}= req.user.access;
  const user = await User.findById(_id).select(["-password","-refreshToken"]);
  if(!user) next(new ErrorHandler(400,"Something Went Wrong!"))

  res.status(200).json({
    success:true,
    user
  })
})
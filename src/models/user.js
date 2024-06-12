import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter Name"],
      unique: [true, "Email already exist"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please enter gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of Birth"],
    },
    refreshToken:{
      type:String
    }
  },
  { timestamps: true }
);



userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});

// Hashing password and calculating and storing age just before saving the data in the database.....
userSchema.pre("save", async function (next) {
  // now hashing and salting the password by using bcrypt....
  if (!this.isModified("password")) next();    
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

// creating methods so that we can generate access and refresh token and can check password

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = async function (accessToken) {
    if(accessToken){
        return jwt.sign(
          { _id: this._id},
          process.env.JWT_SECRET,{
              expiresIn:"1d"
          }
          );
    }
    else{

        // otherwise it is refersh token which will be store in the database..........
        return jwt.sign(
            { _id: this._id},
            process.env.JWT_SECRET,{
                expiresIn:"15d"
            }
            );
    }
};



export const User = mongoose.model("User", userSchema);

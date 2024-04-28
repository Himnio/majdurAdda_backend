import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
      lowercase: true,
    },
    lastName: {
      required: true,
      type: String,
      lowercase: true,
    },
    fullName: {
      required: true,
      type: String,
      lowercase: true,
      index: true,
      trime: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trime: true,
    },
    language: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
      type: String, // cloudinary url
    },
    address: {
      required: true,
      type: String,
      lowercase: true,
      trime: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordisValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//jwt methods
userSchema.methods.genrateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      address: this.address,
      language: this.language,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.genrateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

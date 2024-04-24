import mongoose, { Schema } from "mongoose";

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


export const User = mongoose.model("User", userSchema);

import mongoose, { Schema } from "mongoose";

const majdurSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
      lowercase: true,
    },
    middleName: {
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
    avatar: {
      type: String,
    },
    address: {
      required: true,
      type: String,
      lowercase: true,
      trime: true,
    },
    city: {
      required: true,
      type: String,
      lowercase: true,
    },
    state: {
      required: true,
      type: String,
      lowercase: true,
    },
    //Work time for majdur
    workTiming: {
      required: true,
      type: String,
    },
    //Active ot inactive state
    majdurStatus: {
      required: true,
      type: String,
    },
    workStatus: {
      required: true,
      type: String,
    },
    language: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Majdur = mongoose.model("Majdur", majdurSchema);

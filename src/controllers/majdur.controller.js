import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Majdur } from "../models/majdur.model.js";
import { responseErrorHandler } from "../utils/responseHandler.js";


const registerMajdur = asyncHandler(async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    fullName,
    avatar,
    address,
    city,
    state,
    workTiming,
    majdurStatus,
    workStatus,
    language,
    mobileNumber,
  } = req.body;

  if (
    [
      firstName,
      middleName,
      lastName,
      fullName,
      avatar,
      address,
      city,
      state,
      workTiming,
      majdurStatus,
      workStatus,
      language,
      mobileNumber,
    ].some((field) => field?.trim() === "")
  ) {
    throw new apiErrorHandler(400, "All fields are required");
  }

  //If the majdur already exists or not
  const existedMajdur = await Majdur.findOne({
    $or: [{ fullName }, { mobileNumber }],
  });

  if (existedMajdur) {
    throw new apiErrorHandler(409, "User already exists");
  }

  const majdur = await Majdur.create({
    firstName,
    middleName,
    lastName,
    fullName,
    avatar,
    address,
    city,
    state,
    workTiming,
    majdurStatus,
    workStatus,
    language,
    mobileNumber,
  });

  const createdMajdur = await Majdur.findById(majdur._id);
  console.log(createdMajdur);
  if (!createdMajdur) {
    throw new apiErrorHandler(500, "Something went wrong registering an user");
  }

  return res
    .status(200)
    .json(
      new responseErrorHandler(
        "User is successfully registered",
        201,
        createdMajdur
      )
    );
});

export {registerMajdur};
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { User } from "../models/user.model.js";
import { responseErrorHandler } from "../utils/responseHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, fullName, email, address, password } = req.body;
  console.log(
    "firstName: " + firstName,
    "lastName: " + lastName,
    "fullName: " + fullName,
    "email: " + email,
    "address: " + address,
    "password: " + password
  );
  if (
    [firstName, lastName, fullName, email, address, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new apiErrorHandler(400, "All fields are required");
  }
  //User is already present or not
  const existedUser = await User.findOne({
    $or: [{ fullName }, { email }],
  });

  if (existedUser) {
    throw new apiErrorHandler(409, "User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    fullName,
    email,
    address,
    password,
  });

  console.log(user);

  const createdUser = await User.findById(user._id);
  console.log(createdUser);
  if (!createdUser) {
    throw new apiErrorHandler(500, "Something went wrong registering an user");
  }

  return res
    .status(200)
    .json(
      new responseErrorHandler(
        "User is successfully registered",
        201,
        createdUser
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("email: " + email, "password: " + password);

  if (!email && !password) {
    throw new ApiError(400, "Email and password is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordisValid(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName, firstName, lastName, address } = req.body;
  if (!email || !fullName) {
    throw new ApiError(400, "Email and full name is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
        firstName,
        lastName,
        address
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

export { registerUser, getCurrentUser, loginUser, updateAccountDetails };

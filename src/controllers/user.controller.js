import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { User } from "../models/user.model.js";
import { responseErrorHandler } from "../utils/responseHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //Get the user information from frontend
  //Validation checks
  //Check if user already exists: email, username
  //Create a new user
  //check for the image
  //Upload them to cloudinary server
  //Create a user object
  //remove the password and refresh token
  //Check the user is created
  // return response
  const { firstName, lastName, fullName, email, address } = req.body;
  console.log(
    "firstName: " + firstName,
    "lastName: " + lastName,
    "fullName: " + fullName,
    "email: " + email,
    "address: " + address
  );
  if (
    [firstName, lastName, fullName, email, address].some(
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
  });

  const createdUser = await User.findById(user._id);
  console.log(createdUser);
  if (!createdUser) {
    throw new apiErrorHandler(500, "Something went wrong registering an user");
  }

  return res
    .status(200)
    .json(
      new responseErrorHandler("User is successfully registered",201, createdUser)
    );
});

export { registerUser };

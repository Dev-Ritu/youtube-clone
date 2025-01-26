import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/uploadOnCloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

export const registerUser = asyncHandler(async (req, res) =>
{
const {fullName, email, username, password}= req.body;
if([fullName,email,username,password].some((field)=>field.trim()==="")){
  throw new ApiError(400, "All Fields are required");

}

const existedUser = User.findOne({$or:[{username}, {email}]})

if(existedUser){
  throw new ApiError(409,"User already exists.")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){throw new ApiError(400, "Avatar file is required")}

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar) {throw new ApiError(400,"Avatar file is required")}

const user = await User.create({
  fullName,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  username: username.toLowerCase,
  password,
  email

})

const createdUser = await User.findById(user._id).select("-password -refreshToken");

if(!createdUser){
throw new ApiError(500, "Something went wrong creating the User")
}
});

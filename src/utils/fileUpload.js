import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Logic for file upload
const fileUpload = async (localFileUrl) => {
  try {
    if (!localFileUrl) return null;
    const response = await cloudinary.uploader.upload(localFileUrl, {
      resource_type: "auto",
    });
    console.log("Successfully uploaded", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFileUrl);
    return null;
  }
};

export { fileUpload };

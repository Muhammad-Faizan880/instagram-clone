// utils/uploadProfilePicture.js
import imagekit from "./imageKit.js";

export const uploadProfilePicture = async (fileBuffer, fileName) => {
  const result = await imagekit.upload({
    file: fileBuffer, // Buffer from multer
    fileName: fileName,
  });

  return result.url; // This will be the public image URL
};

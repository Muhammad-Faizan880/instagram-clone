// import path from "path";
// import DataUriParser from "datauri/parser.js"; 

// const parser = new DataUriParser();

// const getDataUri = (file) => {
//     const extName = path.extname(file.originalname).toString();
//     return parser.format(extName, file.buffer).content;
// };

// export default getDataUri;
import bucket from "../utils/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const uploadProfilePicture = async (fileBuffer, fileName) => {
  const file = bucket.file(`profile_pictures/${fileName}`);
  const uuid = uuidv4();

  await file.save(fileBuffer, {
    metadata: {
      contentType: "image/jpeg",
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    file.name
  )}?alt=media&token=${uuid}`;

  return publicUrl;
};

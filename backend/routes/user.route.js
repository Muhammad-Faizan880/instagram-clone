import express from "express"
import { editProfile, followOrUnFollow, getProfile, getSuggestedUsers, Login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addNewPost } from "../controllers/post.controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/edit").put(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").get(isAuthenticated, followOrUnFollow);
router.route("/newPost").post(isAuthenticated,  upload.single("image"), addNewPost)

export default router
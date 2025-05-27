import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadProfilePicture } from "../utils/imageUpload.js";

// Register ............................
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Login ...................................

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
    });
  }
};

// Logout ..........................................

export const logout = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error during logout.",
      success: false,
    });
  }
};

// getProfile .......................................

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// editProfile .......................................


export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { gender, bio } = req.body;
    let profilePictureUrl;

    // Upload profile picture if provided
    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      profilePictureUrl = await uploadProfilePicture(req.file.buffer, fileName);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    // Update fields
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePictureUrl) user.profilePicture = profilePictureUrl;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      success: false,
    });
  }
};

// suggested Users ......................................

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Currently do not have any users!",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// follow or unfollow ..............................

export const followOrUnFollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    // Prevent self-follow
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You can't follow/unfollow yourself",
        success: false,
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Validate users
    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const isAlreadyFollowing = currentUser.following.includes(targetUserId);

    if (isAlreadyFollowing) {
      // Unfollow
      await Promise.all([
        User.updateOne(
          { _id: currentUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: currentUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully!",
        success: true,
      });
    } else {
      // Follow
      await Promise.all([
        User.updateOne(
          { _id: currentUserId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: currentUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Followed successfully!",
        success: true,
      });
    }
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image Required!" });
    }

    // Resize and optimize the image using sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 90 })
      .toBuffer();

    // Convert buffer to Data URI
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // Create new post
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // Push post to user's posts array
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    // Populate author data excluding password
    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Added!",
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error in addNewPost:", error);
    return res.status(500).json({
      message: "Something went wrong while adding the post.",
      success: false,
    });
  }
};

// all possts

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture", // ⬅️ Removed comma ("," is not valid in Mongoose select)
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      post: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts. Please try again later.",
    });
  }
};

// like postsss

export const likePosts = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error in likePosts:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// dislike postss

export const disLikePosts = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    return res.status(200).json({
      message: "Post disliked successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error in disLikePosts:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// add comments

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentAuthorId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Create comment and populate author
    const comment = await Comment.create({
      text,
      author: commentAuthorId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// getCommentsOfPost

export const getCommentsOfPost = async (req, res) => {  
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
        success: false,
      });
    }

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "No comments found for this post",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.error("❌ Error while fetching comments:", error.message);

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false,
      error: error.message,
    });
  }
};

// delete postss

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(401).json({
        message: "Unauthorized: You can delete only your own post",
        success: false,
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the post ID from the user's posts
    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });

  } catch (error) {
    console.error("❌ Error deleting post:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// bookmarkss

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
        success: false,
      });
    }

    const user = await User.findById(authorId);

    const alreadyBookmarked = user.bookmarks.includes(post._id);

    if (alreadyBookmarked) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: 'unsaved',
        message: 'Post removed from bookmarks.',
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: 'saved',
        message: 'Post bookmarked.',
        success: true,
      });
    }
  } catch (error) {
    console.error("❌ Error in bookmarkPost:", error.message);
    return res.status(500).json({
      message: 'Something went wrong. Please try again.',
      success: false,
      error: error.message,
    });
  }
};
 
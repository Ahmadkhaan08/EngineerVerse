import { ApiError } from '../utils/ApiError.js'; // Assuming you have an ApiError utility
import { Post } from "../models/post.models.js";
import {  uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from '../models/user.models.js';

// Like a post
export const likePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) throw new ApiError(404, 'Post not found');

        // Check if user already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'Post already liked.' });
        }

        post.likes.push(userId); // Add user ID to likes
        await post.save();

        res.status(200).json({ message: 'Post liked successfully.' });
    } catch (error) {
        next(error);
    }
};

// Add a comment
export const commentOnPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) throw new ApiError(404, 'Post not found');

        post.comments.push({ user: userId, content }); // Add new comment
        await post.save();

        res.status(200).json({ message: 'Comment added successfully.', post });
    } catch (error) {
        next(error);
    }
};



// Assuming you've already configured Cloudinary

export const createPost = async (req, res, next) => {
    try {
        const { text } = req.body;
        let mediaUrl = null;

        // Check if there is a media file in the request
        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path, {
                folder: "engineer_posts",
            });
            mediaUrl = result.secure_url;
        }

        // Create new post with text and media URL
        const newPost = await Post.create({
            text,
            file: mediaUrl,  // Store the Cloudinary URL
            user: req.user._id,  // Assuming user is stored in req after authentication
        });

        return res.status(201).json({ success: true, post: newPost });

    } catch (error) {
        console.error('Error creating post:', error);  // Log the actual error for debugging
        return res.status(500).json({ success: false, message: "Server error. Unable to create post." });
    }
};



export const getPostById = async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id).populate('author', '-password -refreshToken');
            if (!post) throw new ApiError(404, "Post not found");
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    };
    
    // Get all posts of a specific user (for their profile)
export const getUserPosts = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const posts = await Post.find({ user: userId }).populate('user', '-password -refreshToken');
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    };

    // Get all posts
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('user','username fullName');
        console.log(posts)
        res.status(200).json(posts);
    } catch (error) {
        next(new ApiError(400, "Error fetching posts"));
    }
};

export const getFollowedPosts = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Assuming you have a follow system in place with user.following storing ObjectIds of followed users
        const user = await User.findById(userId).populate('following', '_id');

        const followedIds = user.following.map(followedUser => followedUser._id);

        const posts = await Post.find({ user: { $in: followedIds } }).populate('user', 'username avatar');

        return res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};


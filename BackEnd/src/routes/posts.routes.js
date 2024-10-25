import { Router } from "express";
import {
    createPost,
    getPostById,
    likePost,
    commentOnPost,
    getFollowedPosts, // For fetching followed engineers' posts
    getUserPosts,
    getAllPosts,   // For fetching logged-in user's own posts
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from "../middleware/multer.middleware.js";
import { uploadResume } from "../controllers/user.controller.js";

const router = Router({ mergeParams: true }); // This allows you to access params from the parent route

// Protect routes with verifyJWT middleware
router.post('/create', upload.single('file'), verifyJWT ,createPost); // Create a post for a specific user
router.get('/:id', verifyJWT, getUserPosts); // Get self-created posts for a specific user
router.get('/feed', verifyJWT, getFollowedPosts); // Get posts from followed engineers
router.get('/:postId', getPostById); // Get a specific post
router.post('/:postId/like', verifyJWT, likePost); // Like a post
router.post('/:postId/comment', verifyJWT, commentOnPost); // Comment on a post
router.get('/feed/:user', getAllPosts); // This would expect :user parameter



export default router;

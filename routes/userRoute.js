import express from "express";
import auth from "../middleware/auth.js";
import {
    userRegister,
    login,
    getUserProfile,
    updateUserProfile,
    likePostByUser,
    getUserPosts,
    getUserById,
    getAllUsers,
    forgotPassword,
    resetPassword,
    usersCount,
    getTotalUserPosts,
    verifyUserByAdmin,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/user/register", userRegister);
router.post("/user/login", login);
router.get("/user/profile/:userId", getUserProfile);
router.post("/user/like-post", likePostByUser);
router.get("/user/:userId/posts", getUserPosts);
router.get("/user/:userId", getUserById);
router.get("/users", getAllUsers);
router.get("/users/count", usersCount);
router.get("/users/:userId/postnumber", getTotalUserPosts);
router.post("/forgot-password", forgotPassword);
router.post("/reset", resetPassword);

// Update user profile with profile picture
router.put("/user/profile/:userId/update", auth, updateUserProfile);

// admin section
router.post("/users/:userId/verify", verifyUserByAdmin);

export default router;
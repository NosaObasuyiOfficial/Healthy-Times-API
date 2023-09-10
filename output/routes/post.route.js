"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_1 = require("../controllers/posts");
const getPosts_1 = require("../controllers/getPosts");
const router = express_1.default.Router();
router.post('/create_post', posts_1.create_post);
router.patch('/comments', posts_1.make_comments);
router.patch('/likes', posts_1.like_a_post);
router.patch('/post_update', posts_1.edit_post);
router.delete('/delete', posts_1.delete_post);
router.get('/all_posts/search', getPosts_1.get_all_posts_with_search);
router.get('/all_posts', getPosts_1.get_all_posts);
router.get('/posts', getPosts_1.get_single_post);
exports.default = router;
//Please validate most of your input
//POST TITLE MUST BE UNIQUE
//ADD DISLIKES

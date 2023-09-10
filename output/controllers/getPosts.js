"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_single_post = exports.get_all_posts = exports.get_all_posts_with_search = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
/* -----------------------------------GET ALL BLOG POST WITH SEARCH----------------------------------------*/
const get_all_posts_with_search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const user_validation = yield userModel_1.default.findOne({
                where: {
                    id: user_id
                }
            });
            if (user_validation) {
                const user_role = user_validation.role;
                if (user_role === "user") {
                    const { title } = req.body;
                    const all_posts = [];
                    const all_user_posts = [];
                    const all_posts_info = yield userModel_1.default.findAll();
                    for (const key of all_posts_info) {
                        all_posts.push(key.dataValues.posts);
                    }
                    all_posts.map((all_posts) => {
                        if (all_posts.length > 0) {
                            all_posts.map((post) => {
                                all_user_posts.push(post);
                            });
                        }
                    });
                    if (all_user_posts.length === 0) {
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        });
                    }
                    else {
                        const one_post = all_user_posts.filter((p) => p.title.toLowerCase().includes(title.toLowerCase().trim()));
                        //Pagination Code
                        const page = req.query.page || 1;
                        const perPage = 10;
                        const pageInt = parseInt(page, 10) || 1;
                        ;
                        const startIndex = (pageInt - 1) * perPage;
                        const endIndex = startIndex + perPage;
                        const paginatedPosts = one_post.slice(startIndex, endIndex);
                        if (one_post.length > 0) {
                            const target_post = one_post;
                            return res.status(200).json({
                                message: `SUCCESSFUL ✅ ✅`,
                                data: paginatedPosts,
                                pageInfo: {
                                    currentPage: pageInt,
                                    perPage,
                                    totalPosts: target_post
                                }
                            });
                        }
                        else if (one_post.length < 1) {
                            return res.status(200).json({
                                message: `😢 There are no posts with titled - ${title}`
                            });
                        }
                    }
                }
                else {
                    return res.status(400).json({
                        message: `You are not a registered as a user.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                });
            }
        }
        else {
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            });
        }
    }
    catch (error) {
        console.error("Error getting all post with search:", error);
        return res.status(500).json({ error: "Internal server error - Error getting all post" });
    }
});
exports.get_all_posts_with_search = get_all_posts_with_search;
/* -----------------------------------GET ALL BLOG POSTS----------------------------------------*/
const get_all_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const user_validation = yield userModel_1.default.findOne({
                where: {
                    id: user_id
                }
            });
            if (user_validation) {
                const user_role = user_validation.role;
                if (user_role === "user") {
                    const { title } = req.body;
                    const all_posts = [];
                    const all_user_posts = [];
                    const all_posts_info = yield userModel_1.default.findAll();
                    for (const key of all_posts_info) {
                        all_posts.push(key.dataValues.posts);
                    }
                    all_posts.map((all_posts) => {
                        if (all_posts.length > 0) {
                            all_posts.map((post) => {
                                all_user_posts.push(post);
                            });
                        }
                    });
                    if (all_user_posts.length === 0) {
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        });
                    }
                    else {
                        //Pagination Code
                        const page = req.query.page || 1;
                        const perPage = 10;
                        const pageInt = parseInt(page, 10) || 1;
                        ;
                        const startIndex = (pageInt - 1) * perPage;
                        const endIndex = startIndex + perPage;
                        const paginatedPosts = all_user_posts.slice(startIndex, endIndex);
                        return res.status(200).json({
                            message: `✅ ✅ SUCCESSFUL`,
                            data: paginatedPosts,
                            pageInfo: {
                                currentPage: pageInt,
                                perPage,
                                totalPosts: all_user_posts.length
                            }
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: `You are not a registered as a user.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                });
            }
        }
        else {
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            });
        }
    }
    catch (error) {
        console.error("Error getting all post:", error);
        return res.status(500).json({ error: "Internal server error - Error getting all post" });
    }
});
exports.get_all_posts = get_all_posts;
/* -----------------------------------GET SINGLE BLOG POST----------------------------------------*/
const get_single_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const user_id = decodedToken.id;
            const user_validation = yield userModel_1.default.findOne({
                where: {
                    id: user_id
                }
            });
            if (user_validation) {
                const user_role = user_validation.role;
                if (user_role === "user") {
                    const { title } = req.body;
                    const all_posts = [];
                    const all_user_posts = [];
                    const all_posts_info = yield userModel_1.default.findAll();
                    for (const key of all_posts_info) {
                        all_posts.push(key.dataValues.posts);
                    }
                    all_posts.map((all_posts) => {
                        if (all_posts.length > 0) {
                            all_posts.map((post) => {
                                all_user_posts.push(post);
                            });
                        }
                    });
                    if (all_user_posts.length === 0) {
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        });
                    }
                    else {
                        const one_post = all_user_posts.filter((p) => p.title.toLowerCase().includes(title.toLowerCase().trim()));
                        if (one_post.length === 1) {
                            const target_post = one_post;
                            return res.status(200).json({
                                message: `SUCCESSFUL ✅ ✅`,
                                data: target_post
                            });
                        }
                        else if (one_post.length < 1) {
                            return res.status(200).json({
                                message: `😢 There are no posts with titled - ${title}`
                            });
                        }
                        else if (one_post.length > 1) {
                            return res.status(200).json({
                                message: `Please provide more information to get specific post`
                            });
                        }
                    }
                }
                else {
                    return res.status(400).json({
                        message: `You are not a registered as a user.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                });
            }
        }
        else {
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            });
        }
    }
    catch (error) {
        console.error("Error getting single post:", error);
        return res.status(500).json({ error: "Internal server error - Error getting single post" });
    }
});
exports.get_single_post = get_single_post;

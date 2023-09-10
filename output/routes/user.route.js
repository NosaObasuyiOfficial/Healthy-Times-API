"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post('/signup', user_1.user_Signup);
router.post('/confirmation/:signup_token', user_1.user_verification);
router.post('/login', user_1.user_Login);
router.patch('/profile_update', user_1.user_profile_update);
exports.default = router;

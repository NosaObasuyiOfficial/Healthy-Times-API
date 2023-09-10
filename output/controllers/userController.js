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
exports.user_profile_update = exports.user_Login = exports.user_verification = exports.user_Signup = void 0;
const inputVaidation_1 = require("../utilities/inputVaidation");
const userModel_1 = __importDefault(require("../model/userModel"));
const auth_1 = require("../utilities/auth");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const notification_1 = require("../utilities/notification");
dotenv_1.default.config();
const user_Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputVaidation_1.user_signup;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password, userName, firstName, lastName, city, state, zip, country, posts } = req.body;
        const checking_existing_user = yield userModel_1.default.findOne({
            where: { email: email.trim() }
        });
        if (checking_existing_user) {
            res.status(400).json({
                message: `Account already exists. Kindly login.`
            });
        }
        else {
            const checking_exisiting_userName = yield userModel_1.default.findOne({
                where: { userName: userName.trim() }
            });
            if (checking_exisiting_userName) {
                res.status(400).json({
                    message: `Username already taken. Kindly input a different username.`
                });
            }
            else {
                const hashPassword = yield (0, auth_1.hashedPassword)(password.trim());
                const create_user = yield userModel_1.default.create({
                    id: (0, uuid_1.v4)(),
                    userName: userName.trim(),
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    city,
                    state,
                    zip,
                    country,
                    verification: false,
                    role: "user",
                    posts
                });
                const get_user_details = yield userModel_1.default.findOne({
                    where: { email }
                });
                const user_id = get_user_details.id;
                const user_name = get_user_details.userName;
                const token = jsonwebtoken_1.default.sign({ id: user_id }, process.env.APP_SECRET, { expiresIn: "1d" });
                const html = (0, notification_1.emailHtmlForUser)(user_name, token);
                const sent_mail = yield (0, notification_1.sendmail)(`${process.env.GMAIL_USER}`, email, "Verify your email", html);
                res.status(200).json({
                    message: `ACCOUNT CREATED SUCCESSFULLY. Kindly confirm email and login.`,
                    data: create_user,
                    signup_token: token
                });
            }
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.user_Signup = user_Signup;
const user_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const main_token = token.slice(7);
            const { signup_token } = req.params;
            if (main_token !== signup_token) {
                return res.status(500).json({
                    message: `Cannot verify user. Check verification code`
                });
            }
            else {
                const user_id = decodedToken.id;
                const update_user_verification = yield userModel_1.default.update({ verification: true }, { where: { id: user_id } });
                if (update_user_verification) {
                    return res.status(200).json({
                        message: `Verification SUCCESSFUL`
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Unable to verify user`
                    });
                }
            }
        }
        else {
            return res.status(500).json({
                message: `Require token for authentication`
            });
        }
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.user_verification = user_verification;
const user_Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = inputVaidation_1.user_login;
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user_authentication = yield userModel_1.default.findOne({
            where: {
                email
            }
        });
        if (user_authentication) {
            const user_verification_status = user_authentication.verification;
            if (user_verification_status === true) {
                const validate_user = yield bcrypt_1.default.compare(password, user_authentication.password);
                if (validate_user) {
                    const token = jsonwebtoken_1.default.sign({ id: user_authentication.id }, process.env.APP_SECRET, { expiresIn: "1d" });
                    return res.status(200).json({
                        message: `LOGIN SUCCESSFUL`,
                        userName: user_authentication.userName,
                        token: token
                    });
                }
                else {
                    return res.status(400).json({
                        message: `Incorrect password details.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `Please verify your email before logging in`
                });
            }
        }
        else {
            return res.status(400).json({
                message: `User Details NOT FOUND`
            });
        }
    }
    catch (error) {
        console.error("Error logging-in user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.user_Login = user_Login;
const user_profile_update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const token_info = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token_info, process.env.APP_SECRET);
        if (decodedToken) {
            const schema = inputVaidation_1.user_updates;
            const { error, value } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { firstName, lastName, city, state, zip, country } = req.body;
            const user_id = decodedToken.id;
            const user_validation = yield userModel_1.default.findOne({
                where: {
                    id: user_id
                }
            });
            if (user_validation) {
                const user_role = user_validation.role;
                const user_email = user_validation.email;
                if (user_role === "user") {
                    const user_update_profile = yield userModel_1.default.update({ firstName: firstName.trim(), lastName: lastName.trim(), city: city.trim(), state: state.trim(), zip, country: country.trim() }, {
                        where: {
                            email: user_email
                        }
                    });
                    if (user_update_profile) {
                        const user_update = yield userModel_1.default.findOne({
                            where: {
                                id: user_id
                            }
                        });
                        return res.status(200).json({
                            message: `Profile has been UPDATED successfully`,
                            data: user_update
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: `update PROFILE FAILED.`
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: `You are not registered as a USER.`
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: `User details not FOUND.`
                });
            }
        }
        else {
            return res.status(500).json({
                message: `Require token for authentication.`
            });
        }
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.user_profile_update = user_profile_update;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_updates = exports.user_login = exports.user_signup = void 0;
const joi_1 = __importDefault(require("joi"));
exports.user_signup = joi_1.default.object({
    userName: joi_1.default.string().required()
        .messages({
        'any.required': 'user_name is required'
    }),
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.user_login = joi_1.default.object({
    email: joi_1.default.string().email().required()
        .messages({
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(7)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 7 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        'any.required': 'Password is required',
    })
});
exports.user_updates = joi_1.default.object({
    firstName: joi_1.default.string().allow(''),
    lastName: joi_1.default.string().allow(''),
    city: joi_1.default.string().allow(''),
    state: joi_1.default.string().allow(''),
    zip: joi_1.default.string().allow(''),
    country: joi_1.default.string().allow('')
});

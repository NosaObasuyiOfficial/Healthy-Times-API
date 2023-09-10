"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = ({ page, limit }) => {
    const offset = (page - 1) * limit;
    return { offset, limit };
};
exports.getPagination = getPagination;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserId = exports.getCurrentUser = void 0;
const express_http_context_1 = __importDefault(require("express-http-context"));
function getCurrentUser(field) {
    const user = express_http_context_1.default.get('user');
    return user ? (field ? user[field] : user) : null;
}
exports.getCurrentUser = getCurrentUser;
function getCurrentUserId() {
    const user = getCurrentUser();
    return user ? Number(user.id) : null;
}
exports.getCurrentUserId = getCurrentUserId;

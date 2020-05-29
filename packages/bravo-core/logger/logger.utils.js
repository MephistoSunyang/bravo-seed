"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.getLogFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
exports.getLogFolder = () => {
    const folder = process.env.DEBUG_FOLDER || 'logs/';
    return path_1.default.join(process.cwd(), folder);
};
exports.logger = (category) => {
    const folder = exports.getLogFolder();
    const pattern = process.env.DEBUG_PATTERN || 'yyyy-MM-dd.log';
    const level = process.env.DEBUG_LEVEL || 'all';
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder);
    }
    log4js_1.default.configure({
        appenders: {
            app: {
                type: 'dateFile',
                filename: folder,
                pattern,
                alwaysIncludePattern: true,
            },
        },
        categories: {
            default: {
                appenders: ['app'],
                level,
            },
        },
    });
    return log4js_1.default.getLogger(category);
};

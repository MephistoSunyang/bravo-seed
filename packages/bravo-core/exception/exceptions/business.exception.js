"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../../shared");
class BusinessException extends common_1.HttpException {
    constructor(message, codeOrFrontendMessage, frontendMessage = '') {
        let code = shared_1.HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
        if (codeOrFrontendMessage) {
            if (typeof codeOrFrontendMessage === 'string') {
                frontendMessage = codeOrFrontendMessage;
            }
            else {
                code = codeOrFrontendMessage;
            }
        }
        super(message, code);
        this.frontendMessage = frontendMessage;
    }
}
exports.BusinessException = BusinessException;

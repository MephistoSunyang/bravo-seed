"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleException = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../shared");
const exceptions_1 = require("./exceptions");
exports.handleException = (error, response) => {
    let status = shared_1.HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    let code = shared_1.HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    if (error instanceof exceptions_1.BusinessException) {
        status = shared_1.HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
        code = error.getStatus();
    }
    else if (error instanceof common_1.HttpException) {
        status = code = error.getStatus();
    }
    response.status(status).send(shared_1.createResult(error, code));
};

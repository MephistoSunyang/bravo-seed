"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableExceptionLog = void 0;
const common_1 = require("@nestjs/common");
exports.DisableExceptionLog = () => common_1.SetMetadata('disableExceptionLogEnable', true);

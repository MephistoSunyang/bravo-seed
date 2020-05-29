"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableResult = void 0;
const common_1 = require("@nestjs/common");
exports.DisableResult = () => common_1.SetMetadata('disableResult', true);

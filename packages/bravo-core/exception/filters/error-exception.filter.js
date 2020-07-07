"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exception_utils_1 = require("../exception.utils");
let ErrorExceptionFilter = (() => {
    let ErrorExceptionFilter = class ErrorExceptionFilter {
        catch(error, host) {
            const http = host.switchToHttp();
            const response = http.getResponse();
            exception_utils_1.handleException(error, response);
        }
    };
    ErrorExceptionFilter = __decorate([
        common_1.Catch(Error)
    ], ErrorExceptionFilter);
    return ErrorExceptionFilter;
})();
exports.ErrorExceptionFilter = ErrorExceptionFilter;

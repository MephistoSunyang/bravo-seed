"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const exception_1 = require("./exception");
const interceptor_1 = require("./interceptor");
const middleware_1 = require("./middleware");
const modules = [exception_1.ExceptionModule, interceptor_1.InterceptorModule, middleware_1.MiddlewareModule];
let CoreModule = (() => {
    let CoreModule = class CoreModule {
    };
    CoreModule = __decorate([
        common_1.Module({
            imports: [...modules],
        })
    ], CoreModule);
    return CoreModule;
})();
exports.CoreModule = CoreModule;

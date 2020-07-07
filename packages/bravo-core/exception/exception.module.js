"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionModule = void 0;
const common_1 = require("@nestjs/common");
const filters_1 = require("./filters");
const filters = [filters_1.ErrorExceptionFilter, filters_1.HttpExceptionFilter];
const providers = [...filters];
let ExceptionModule = (() => {
    let ExceptionModule = class ExceptionModule {
    };
    ExceptionModule = __decorate([
        common_1.Module({
            providers,
        })
    ], ExceptionModule);
    return ExceptionModule;
})();
exports.ExceptionModule = ExceptionModule;

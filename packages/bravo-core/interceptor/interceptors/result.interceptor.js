"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const shared_1 = require("../../shared");
let ResultInterceptor = (() => {
    let ResultInterceptor = class ResultInterceptor {
        constructor(reflector) {
            this.reflector = reflector;
        }
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            const disableResult = this.reflector.get('disableResult', context.getHandler());
            return next.handle().pipe(operators_1.map((data) => {
                const code = response.statusCode;
                if (!disableResult) {
                    response.status(shared_1.HTTP_STATUS_CODE_ENUM.OK);
                    return shared_1.createResult(data, code);
                }
                else {
                    return data;
                }
            }));
        }
    };
    ResultInterceptor = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [core_1.Reflector])
    ], ResultInterceptor);
    return ResultInterceptor;
})();
exports.ResultInterceptor = ResultInterceptor;

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
exports.ExceptionLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const logger_1 = require("../../logger");
let ExceptionLogInterceptor = (() => {
    let ExceptionLogInterceptor = class ExceptionLogInterceptor {
        constructor(reflector) {
            this.reflector = reflector;
        }
        intercept(context, next) {
            const disableExceptionLogEnable = this.reflector.get('disableExceptionLogEnable', context.getHandler());
            const request = context.switchToHttp().getRequest();
            return next.handle().pipe(operators_1.catchError((error) => {
                if (!disableExceptionLogEnable) {
                    let message = `[${request.method.toUpperCase()}]${request.url}`;
                    if (request.body) {
                        message += `\nbody: ${JSON.stringify(request.body)}`;
                    }
                    logger_1.Logger.log(message, 'InterceptorModule ExceptionLogInterceptor');
                    logger_1.Logger.error(error.message, 'InterceptorModule ExceptionLogInterceptor Error', error.stack);
                }
                return rxjs_1.throwError(error);
            }));
        }
    };
    ExceptionLogInterceptor = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [core_1.Reflector])
    ], ExceptionLogInterceptor);
    return ExceptionLogInterceptor;
})();
exports.ExceptionLogInterceptor = ExceptionLogInterceptor;

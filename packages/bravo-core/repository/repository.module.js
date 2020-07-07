"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const repository_utils_1 = require("./repository.utils");
const services_1 = require("./services");
let RepositoryModule = (() => {
    var RepositoryModule_1;
    let RepositoryModule = RepositoryModule_1 = class RepositoryModule {
        static forFeature(entities) {
            const modules = [typeorm_1.TypeOrmModule.forFeature([entities_1.AuditLogEntity, ...entities])];
            const services = [services_1.AuditLogService, ...repository_utils_1.getRepositoryServiceProviders(entities)];
            const providers = [...services];
            return {
                module: RepositoryModule_1,
                imports: [...modules],
                providers,
                exports: [...providers],
            };
        }
    };
    RepositoryModule = RepositoryModule_1 = __decorate([
        common_1.Global(),
        common_1.Module({})
    ], RepositoryModule);
    return RepositoryModule;
})();
exports.RepositoryModule = RepositoryModule;

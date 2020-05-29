"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryServiceToken = exports.getRepositoryServiceProviders = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const services_1 = require("./services");
exports.getRepositoryServiceProviders = (entities = []) => {
    const providers = entities.map((entity) => {
        const provider = {
            provide: exports.getRepositoryServiceToken(entity),
            inject: [typeorm_1.getRepositoryToken(entity), services_1.AuditLogService],
            useFactory: (repository, auditLogService) => {
                return new services_1.RepositoryService(repository, auditLogService);
            },
        };
        return provider;
    });
    return providers;
};
exports.getRepositoryServiceToken = (entity) => `${entity.name}RepositoryServiceToken`;

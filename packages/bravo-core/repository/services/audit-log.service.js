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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = __importDefault(require("lodash"));
const typeorm_2 = require("typeorm");
const logger_1 = require("../../logger");
const metadata_storage_1 = require("../../metadata-storage");
const entities_1 = require("../entities");
let AuditLogService = (() => {
    let AuditLogService = class AuditLogService {
        constructor(auditLogRepository) {
            this.auditLogRepository = auditLogRepository;
        }
        getAuditLogModels(metadata, action, entities, contentResolver, createdUserId) {
            const schemaName = metadata.schema ? metadata.schema : 'dbo';
            const tableName = metadata.tableName;
            const models = entities.map((entity) => this.auditLogRepository.create({
                schemaName,
                tableName,
                action,
                content: contentResolver(entity),
                createdUserId,
            }));
            return models;
        }
        insert(metadata, action, entityOrEntities) {
            return __awaiter(this, void 0, void 0, function* () {
                const auditLogMetadata = metadata_storage_1.getMetadataArgsStorage().findAuditLog(metadata.target);
                if (!auditLogMetadata || !auditLogMetadata.enable) {
                    return;
                }
                const createdUserId = auditLogMetadata.createdUserIdResolver();
                const auditLogModels = this.getAuditLogModels(metadata, action, lodash_1.default.castArray(entityOrEntities), auditLogMetadata.contentResolver, createdUserId);
                if (auditLogModels.length === 0) {
                    return;
                }
                try {
                    this.auditLogRepository.save(auditLogModels, { chunk: 200 });
                }
                catch (error) {
                    logger_1.Logger.log(auditLogModels, 'RepositoryModule AuditLogService');
                    logger_1.Logger.error(error.message, 'RepositoryModule AuditLogService Error');
                }
            });
        }
    };
    AuditLogService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(entities_1.AuditLogEntity)),
        __metadata("design:paramtypes", [typeorm_2.Repository])
    ], AuditLogService);
    return AuditLogService;
})();
exports.AuditLogService = AuditLogService;

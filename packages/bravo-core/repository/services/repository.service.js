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
exports.RepositoryService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const audit_log_service_1 = require("./audit-log.service");
let RepositoryService = (() => {
    let RepositoryService = class RepositoryService {
        constructor(repository, auditLogService) {
            this.repository = repository;
            this.auditLogService = auditLogService;
            this.manager = repository.manager;
            this.metadata = repository.metadata;
            this.queryRunner = repository.queryRunner;
        }
        get isSoftDelete() {
            return this.metadata.deleteColumn !== undefined;
        }
        get softDeleteField() {
            return this.metadata.deleteColumn ? this.metadata.deleteColumn.propertyName : '';
        }
        getEntitiesByIdsOrConditions(idsOrConditions) {
            return __awaiter(this, void 0, void 0, function* () {
                const entities = lodash_1.default.isArray(idsOrConditions) && lodash_1.default.isNumber(idsOrConditions[0])
                    ? yield this.findByIds(idsOrConditions)
                    : yield this.find(idsOrConditions);
                return entities;
            });
        }
        create(entityLikeOrEntityLikes) {
            return this.repository.create(entityLikeOrEntityLikes);
        }
        merge(...entityLikes) {
            return this.repository.merge(this.create(), ...entityLikes);
        }
        count(optionsOrConditions) {
            return this.repository.count(optionsOrConditions);
        }
        find(optionsOrConditions) {
            return this.repository.find(optionsOrConditions);
        }
        findAndCount(optionsOrConditions) {
            return this.repository.findAndCount(optionsOrConditions);
        }
        findByIds(ids, optionsOrConditions) {
            return __awaiter(this, void 0, void 0, function* () {
                const chunkEntities = yield Promise.all(lodash_1.default.chain(ids)
                    .uniq()
                    .chunk(2000)
                    .map((chunkIds) => this.repository.findByIds(chunkIds, optionsOrConditions))
                    .value());
                const entities = lodash_1.default.flatMap(chunkEntities);
                return entities;
            });
        }
        findOne(idOrOptionsOrConditions, maybeOptions) {
            return this.repository.findOne(idOrOptionsOrConditions, maybeOptions);
        }
        insert(partialModel, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const entity = yield this.repository.save(this.create(partialModel), options);
                this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.CREATE, entity);
                return entity;
            });
        }
        insertBulk(partialModels, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (partialModels.length === 0) {
                    return [];
                }
                const entities = yield this.repository.save(this.create(partialModels), options);
                this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.CREATE, entities);
                return entities;
            });
        }
        update(idOrConditions, partialModel, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const entity = yield this.findOne(idOrConditions);
                if (!entity) {
                    return;
                }
                const model = this.isSoftDelete
                    ? this.merge(entity, partialModel, { [this.softDeleteField]: false })
                    : this.merge(entity, partialModel);
                const updatedEntity = yield this.repository.save(model, options);
                this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.UPDATE, updatedEntity);
                return updatedEntity;
            });
        }
        updateBulk(idsOrConditions, partialModelOrPartialModels, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const entities = yield this.getEntitiesByIdsOrConditions(idsOrConditions);
                if (entities.length === 0) {
                    return [];
                }
                const models = entities.map((entity, index) => this.isSoftDelete
                    ? this.merge(entity, lodash_1.default.isArray(partialModelOrPartialModels)
                        ? partialModelOrPartialModels[index]
                        : partialModelOrPartialModels, { [this.softDeleteField]: false })
                    : this.merge(entity, lodash_1.default.isArray(partialModelOrPartialModels)
                        ? partialModelOrPartialModels[index]
                        : partialModelOrPartialModels));
                const updatedEntities = yield this.repository.save(models, options);
                this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.UPDATE, updatedEntities);
                return updatedEntities;
            });
        }
        delete(idOrConditions, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const entity = yield this.findOne(idOrConditions);
                if (!entity) {
                    return;
                }
                const cloneEntity = lodash_1.default.clone(entity);
                let deletedEntity;
                if (this.isSoftDelete) {
                    const model = this.merge(entity, { [this.softDeleteField]: true });
                    deletedEntity = yield this.repository.save(model, options);
                    this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.DELETE, deletedEntity);
                }
                else {
                    deletedEntity = yield this.repository.remove(entity, options);
                    this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.DELETE, cloneEntity);
                }
                return deletedEntity;
            });
        }
        deleteBulk(idsOrConditions, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const entities = yield this.getEntitiesByIdsOrConditions(idsOrConditions);
                if (entities.length === 0) {
                    return [];
                }
                let deletedEntities;
                if (this.isSoftDelete) {
                    const models = entities.map((deletedEntity) => this.merge(deletedEntity, { [this.softDeleteField]: true }));
                    deletedEntities = yield this.repository.save(models, options);
                    this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.DELETE, deletedEntities);
                }
                else {
                    deletedEntities = yield this.repository.remove(entities, options);
                    this.auditLogService.insert(this.metadata, enums_1.AUDIT_LOG_ACTION_ENUM.DELETE, entities);
                }
                return deletedEntities;
            });
        }
        createQueryBuilder(alias, queryRunner) {
            return this.repository.createQueryBuilder(alias, queryRunner);
        }
        query(query, parameters) {
            return this.repository.query(query, parameters);
        }
        clear() {
            return this.repository.clear();
        }
    };
    RepositoryService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [typeorm_1.Repository,
            audit_log_service_1.AuditLogService])
    ], RepositoryService);
    return RepositoryService;
})();
exports.RepositoryService = RepositoryService;

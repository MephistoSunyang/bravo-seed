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
exports.AuditLogEntity = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
let AuditLogEntity = (() => {
    let AuditLogEntity = class AuditLogEntity {
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], AuditLogEntity.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column('varchar'),
        __metadata("design:type", String)
    ], AuditLogEntity.prototype, "schemaName", void 0);
    __decorate([
        typeorm_1.Column('varchar'),
        __metadata("design:type", String)
    ], AuditLogEntity.prototype, "tableName", void 0);
    __decorate([
        typeorm_1.Column('int'),
        __metadata("design:type", String)
    ], AuditLogEntity.prototype, "tableId", void 0);
    __decorate([
        typeorm_1.Column('varchar'),
        __metadata("design:type", String)
    ], AuditLogEntity.prototype, "action", void 0);
    __decorate([
        typeorm_1.Column('nvarchar', { length: 'MAX' }),
        __metadata("design:type", String)
    ], AuditLogEntity.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column('nvarchar', { nullable: true }),
        __metadata("design:type", Object)
    ], AuditLogEntity.prototype, "createdUserId", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], AuditLogEntity.prototype, "createdDate", void 0);
    AuditLogEntity = __decorate([
        typeorm_1.Entity({ schema: 'system', name: 'audit-logs' })
    ], AuditLogEntity);
    return AuditLogEntity;
})();
exports.AuditLogEntity = AuditLogEntity;

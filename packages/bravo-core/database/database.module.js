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
exports.DataBaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = __importDefault(require("lodash"));
const typeorm_2 = require("typeorm");
let DataBaseModule = (() => {
    var DataBaseModule_1;
    let DataBaseModule = DataBaseModule_1 = class DataBaseModule {
        constructor(connection) {
            this.connection = connection;
        }
        static forRoot(options) {
            this.synchronize = options.synchronize || false;
            const modules = [typeorm_1.TypeOrmModule.forRoot(lodash_1.default.extend(options, { synchronize: false }))];
            return {
                module: DataBaseModule_1,
                imports: [...modules],
            };
        }
        onModuleInit() {
            return __awaiter(this, void 0, void 0, function* () {
                if (DataBaseModule_1.synchronize) {
                    const { driver, entityMetadatas } = this.connection;
                    const queryRunner = driver.createQueryRunner('master');
                    const databaseSchemas = yield queryRunner.getSchemas();
                    const schemas = lodash_1.default.chain(entityMetadatas)
                        .map('schema')
                        .compact()
                        .difference(databaseSchemas)
                        .value();
                    yield Promise.all(schemas.map((schema) => queryRunner.createSchema(schema)));
                    yield this.connection.synchronize();
                }
            });
        }
    };
    DataBaseModule.synchronize = false;
    DataBaseModule = DataBaseModule_1 = __decorate([
        common_1.Global(),
        common_1.Module({}),
        __param(0, typeorm_1.InjectConnection()),
        __metadata("design:paramtypes", [typeorm_2.Connection])
    ], DataBaseModule);
    return DataBaseModule;
})();
exports.DataBaseModule = DataBaseModule;

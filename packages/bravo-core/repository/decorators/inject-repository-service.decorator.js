"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectRepositoryService = void 0;
const common_1 = require("@nestjs/common");
const repository_utils_1 = require("../repository.utils");
exports.InjectRepositoryService = (entity) => common_1.Inject(repository_utils_1.getRepositoryServiceToken(entity));

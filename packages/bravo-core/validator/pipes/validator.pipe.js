'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidatorPipe = void 0;
const common_1 = require('@nestjs/common');
const class_transformer_1 = require('class-transformer');
const class_validator_1 = require('class-validator');
const lodash_1 = __importDefault(require('lodash'));
const logger_1 = require('../../logger');
let ValidatorPipe = (() => {
  let ValidatorPipe = class ValidatorPipe {
    toValidate(metatype) {
      const types = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
    getErrorMessage(errors) {
      let message = errors.toString();
      const constraints = lodash_1.default
        .chain(errors)
        .flatMap('constraints')
        .map((constraint) => lodash_1.default.values(constraint))
        .flatMap()
        .value();
      if (constraints.length === 0) {
        return message;
      }
      message += 'The constraints messages:';
      message += constraints.map((constraint) => `\n - ${constraint}`);
      return message;
    }
    transform(value, { metatype }) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!metatype || !this.toValidate(metatype)) {
          return value;
        }
        const json = class_transformer_1.plainToClass(metatype, value, {
          strategy: 'excludeAll',
          enableCircularCheck: true,
          enableImplicitConversion: true,
        });
        const errors = yield class_validator_1.validate(json);
        if (errors.length > 0) {
          logger_1.Logger.error(
            this.getErrorMessage(errors),
            'ValidatorModule ValidatorPipe Error',
          );
          throw new common_1.BadRequestException('validation failed!');
        }
        return value;
      });
    }
  };
  ValidatorPipe = __decorate([common_1.Injectable()], ValidatorPipe);
  return ValidatorPipe;
})();
exports.ValidatorPipe = ValidatorPipe;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../../../shared/redis");
const academicDepartment_constants_1 = require("./academicDepartment.constants");
const academicDepartment_service_1 = require("./academicDepartment.service");
const initAcademicDepartmentEvents = () => {
    redis_1.RedisClient.subscribe(academicDepartment_constants_1.EVENT_ACADEMIC_DEPARTMENT_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicDepartment_service_1.AcademicDepartmentService.insertIntoDBFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(academicDepartment_constants_1.EVENT_ACADEMIC_DEPARTMENT_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicDepartment_service_1.AcademicDepartmentService.updateOneInDBFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(academicDepartment_constants_1.EVENT_ACADEMIC_DEPARTMENT_DELETED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicDepartment_service_1.AcademicDepartmentService.deleteOneFromDBFromEvent(data.id);
    }));
};
exports.default = initAcademicDepartmentEvents;

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
const academicFaculty_constants_1 = require("./academicFaculty.constants");
const academicFaculty_service_1 = require("./academicFaculty.service");
const initAcademicFacultyEvents = () => {
    redis_1.RedisClient.subscribe(academicFaculty_constants_1.EVENT_ACADEMIC_FACULTY_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.insertIntoDBFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(academicFaculty_constants_1.EVENT_ACADEMIC_FACULTY_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.updateOneInDBFromEvent(data);
    }));
    redis_1.RedisClient.subscribe(academicFaculty_constants_1.EVENT_ACADEMIC_FACULTY_DELETED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(e);
        yield academicFaculty_service_1.AcademicFacultyService.deleteOneFromDBFromEvent(data.id);
    }));
};
exports.default = initAcademicFacultyEvents;

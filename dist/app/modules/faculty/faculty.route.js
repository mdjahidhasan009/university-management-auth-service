"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_controller_1 = require("./faculty.controller");
const faculty_validations_1 = require("./faculty.validations");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const users_1 = require("../../../enums/users");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.FACULTY), faculty_controller_1.FacultyController.getSingleFaculty);
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.FACULTY), faculty_controller_1.FacultyController.getAllFaculties);
router.patch('/:id', (0, validateRequest_1.default)(faculty_validations_1.FacultyValidation.updateFacultyZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN), faculty_controller_1.FacultyController.updateFaculty);
router.delete('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN), faculty_controller_1.FacultyController.deleteFaculty);
exports.FacultyRoutes = router;

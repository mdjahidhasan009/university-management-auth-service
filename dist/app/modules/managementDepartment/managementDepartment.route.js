"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../../../enums/users");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const managementDepartment_controller_1 = require("./managementDepartment.controller");
const managementDepartment_validation_1 = require("./managementDepartment.validation");
const router = express_1.default.Router();
router.post('/create-department', (0, validateRequest_1.default)(managementDepartment_validation_1.ManagementDepartmentValidation.createManagementDepartmentZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN), managementDepartment_controller_1.ManagementDepartmentController.createDepartment);
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.FACULTY, users_1.ENUM_USER_ROLE.STUDENT), managementDepartment_controller_1.ManagementDepartmentController.getSingleDepartment);
router.patch('/:id', (0, validateRequest_1.default)(managementDepartment_validation_1.ManagementDepartmentValidation.updateManagementDepartmentZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN), managementDepartment_controller_1.ManagementDepartmentController.updateDepartment);
router.delete('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN), managementDepartment_controller_1.ManagementDepartmentController.deleteDepartment);
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SUPER_ADMIN, users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.FACULTY, users_1.ENUM_USER_ROLE.FACULTY, users_1.ENUM_USER_ROLE.STUDENT), managementDepartment_controller_1.ManagementDepartmentController.getAllDepartments);
exports.ManagementDepartmentRoutes = router;

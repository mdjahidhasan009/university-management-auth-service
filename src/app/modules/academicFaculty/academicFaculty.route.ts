import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validations';
import { ENUM_USER_ROLE } from '../../../enums/users';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-faculty',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  AcademicFacultyController.createFaculty
);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT
  ),
  AcademicFacultyController.getSingleFaculty
);

router.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  validateRequest(AcademicFacultyValidation.updatefacultyZodSchema),
  AcademicFacultyController.updateFaculty
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyController.deleteFaculty
);

router.get(
  '/',
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.STUDENT
  // ),
  AcademicFacultyController.getAllFaculties
);

export const AcademicFacultyRoutes = router;

import express from 'express';
import { SemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/ academicDepartment.routes';
import { StudentRoutes } from '../modules/student/student.route';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters/',
    route: SemesterRoutes,
  },
  {
    path: '/users/',
    route: UserRoutes,
  },
  {
    path: '/academic-faculties/',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments/',
    route: academicDepartmentRoutes,
  },
  {
    path: '/students/',
    route: StudentRoutes,
  },
  {
    path: '/auth/',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

// router.use('/users/', UserRoutes);
// router.use('/academic-semester/', SemesterRoutes);

export default router;

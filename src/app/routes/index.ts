import express from 'express';
import { SemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semester/',
    route: SemesterRoutes,
  },
  {
    path: '/users/',
    route: UserRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

// router.use('/users/', UserRoutes);
// router.use('/academic-semester/', SemesterRoutes);

export default router;

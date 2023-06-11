import express, { Application } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { SemesterRoutes } from './app/modules/academicSemester/academicSemester.route';

const app: Application = express();
app.use(cors());

//console.log(app.get('env')) //env type development or production, default is development
//console.log(process.env) //to see all enviroment variable

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users/', UserRoutes);
app.use('/api/v1/academic-semester/', SemesterRoutes);

// app.get('/', async(req, res, next) => {
//   // throw new ApiError(400,'error') // will be picked by if(err instanceof Error) {
//   //throw new Error('dd')
//   // next('dddd')
//     await Promise.reject(new Error('Unhandled Promise Rejection'))
// })

//global error handler
app.use(globalErrorHandler);

export default app;

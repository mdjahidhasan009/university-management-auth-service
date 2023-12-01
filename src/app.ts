import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';

const app: Application = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        (process.env.CORS && process.env.CORS.includes(<string>origin)) ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

//console.log(app.get('env')) //env type development or production, default is development
//console.log(process.env) //to see all enviroment variable

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/users/', UserRoutes);
// app.use('/api/v1/academic-semester/', SemesterRoutes);
app.use('/api/v1', router);

// app.get('/', async(req, res, next) => {
//   // throw new ApiError(400,'error') // will be picked by if(err instanceof Error) {
//   //throw new Error('dd')
//   // next('dddd')
//     await Promise.reject(new Error('Unhandled Promise Rejection'))
// })

//global error handler
app.use(globalErrorHandler);

//handler not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
    data: null,
  });
  next();
});

export default app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if ((process.env.CORS && process.env.CORS.includes(origin)) ||
            !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//console.log(app.get('env')) //env type development or production, default is development
//console.log(process.env) //to see all enviroment variable
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use('/api/v1/users/', UserRoutes);
// app.use('/api/v1/academic-semester/', SemesterRoutes);
app.use('/api/v1', routes_1.default);
// app.get('/', async(req, res, next) => {
//   // throw new ApiError(400,'error') // will be picked by if(err instanceof Error) {
//   //throw new Error('dd')
//   // next('dddd')
//     await Promise.reject(new Error('Unhandled Promise Rejection'))
// })
//global error handler
app.use(globalErrorHandler_1.default);
//handler not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
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
exports.default = app;

import express, { Application } from 'express'
import cors from 'cors'
import { UserRoutes } from './app/modules/users/user.route'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

const app: Application = express()
app.use(cors())

//console.log(app.get('env')) //env type development or production, default is development
//console.log(process.env) //to see all enviroment variable

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users/', UserRoutes)

// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('error') // will be picked by if(err instanceof Error) {
//   // next('dddd')
// })

//global error handler
app.use(globalErrorHandler)

export default app

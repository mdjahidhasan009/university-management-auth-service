import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import usersRouter from './app/modules/users/users.route'

const app: Application = express()
app.use(cors())

//console.log(app.get('env')) //env type development or production, default is development
//console.log(process.env) //to see all enviroment variable

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users/', usersRouter)

class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message)
    this.statusCode = statusCode
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor) ////Note: Have to study about this
    }
  }
}

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  // res.send('Working Successfully');
  // throw new ApiError(400, 'error');//using custom class
  throw new Error('error') // will be picked by if(err instanceof Error) {
  // next('dddd')
})

//global error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(400).json({ error: err })
  } else {
    res.status(500).json({ error: 'Something Went Wrong!' })
  }
})

export default app

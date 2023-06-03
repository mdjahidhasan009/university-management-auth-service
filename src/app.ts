import express, { Application, Request, Response } from 'express'
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

app.get('/', async (req: Request, res: Response) => {
  res.send('Working Successfully')
})

export default app

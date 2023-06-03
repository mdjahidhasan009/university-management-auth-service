import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })
console.log(path.join(process.cwd(), '.env'))

export default {
  port: process.env.PORT,
  database_urls: process.env.DATABASE_URL,
  default_user_pass: process.env.DEFAULT_USER_PASS,
}

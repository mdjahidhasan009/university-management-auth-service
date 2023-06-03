import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { logger, errorLogger } from './shared/logger'

const boostrap = async () => {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info('Database is connected successfully')
    app.listen(config.port, () =>
      logger.info(`Server is running on port = `, config.port)
    )
  } catch (e) {
    errorLogger.error('Failed to connect database', e)
  }
}

boostrap()

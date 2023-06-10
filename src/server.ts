import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

const boostrap = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database is connected successfully');

    server = app.listen(config.port, () =>
      logger.info(`Server is running on port = `, config.port)
    );
  } catch (e) {
    errorLogger.error('Failed to connect database', e);
  }

  process.on('unhandledRejection', error => {
    console.info('unhandled recection');
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  // if (server) {
  //   server.close()
  // }
});

boostrap();

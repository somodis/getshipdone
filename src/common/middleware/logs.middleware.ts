import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from 'src/database/entity/user.entity';

@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, body, user } = request;
      const { statusCode, statusMessage } = response;

      const userObj = user as UserEntity;
      const userId = userObj?.id;

      const message = `${method} ${originalUrl}: [${JSON.stringify(
        body,
      )}] > ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(message, 'HTTP', userId);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message, 'HTTP', userId);
      }

      if (method !== 'GET') {
        return this.logger.log(message, 'HTTP', userId);
      }

      return this.logger.debug(message, 'HTTP', userId);
    });

    next();
  }
}
export default LogsMiddleware;

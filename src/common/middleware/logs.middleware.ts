import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, body } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl}: [${JSON.stringify(
        body,
      )}] > ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      if (method !== 'GET') {
        return this.logger.log(message);
      }

      return this.logger.debug(message);
    });

    next();
  }
}
export default LogsMiddleware;

import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import getLogLevels from 'src/config/getLogLevels';
import LogsService from './logs.service';

@Injectable()
class CustomLogger extends ConsoleLogger {
  private readonly logsService: LogsService;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    logsService: LogsService,
  ) {
    const environment = configService.get('NODE_ENV');

    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });

    this.logsService = logsService;
  }

  log(message: string, context?: string, userId?: number) {
    super.log.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      userId,
      level: 'log',
    });
  }
  error(message: string, stack?: string, context?: string, userId?: number) {
    super.error.apply(this, [message, stack, context]);

    this.logsService.createLog({
      message,
      context,
      userId,
      level: 'error',
    });
  }
  warn(message: string, context?: string, userId?: number) {
    super.warn.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      userId,
      level: 'warn',
    });
  }

  debug(message: string, context?: string, userId?: number) {
    super.debug.apply(this, [message, context]);

    this.isLevelEnabled('debug') &&
      this.logsService.createLog({
        message,
        context,
        userId,
        level: 'debug',
      });
  }

  verbose(message: string, context?: string, userId?: number) {
    super.debug.apply(this, [message, context]);

    this.isLevelEnabled('verbose') &&
      this.logsService.createLog({
        message,
        context,
        userId,
        level: 'verbose',
      });
  }
}

export default CustomLogger;

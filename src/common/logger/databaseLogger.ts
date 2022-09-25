import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (
      process.env.NODE_ENV === 'production' ||
      queryRunner?.data?.isCreatingLogs
    ) {
      return;
    }

    this.logger.log(
      `${query} -- Parameters: ${this.stringifyParameters(parameters)}`,
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    this.logger.error(
      `${query} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${error}`,
      '',
      'SQL',
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    this.logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${query}`,
      'SQL',
    );
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }
  logMigration(message: string) {
    this.logger.log(message);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: string,
    queryRunner?: QueryRunner,
  ) {
    if (
      process.env.NODE_ENV === 'production' ||
      queryRunner?.data?.isCreatingLogs
    ) {
      return;
    }

    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
export default DatabaseLogger;

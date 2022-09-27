import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Log from 'src/database/log/logs.entity';
import { Repository } from 'typeorm';
import CreateLogDto from './dto/create-log.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log, 'logsConnection')
    private logsRepository: Repository<Log>,
  ) {}

  /**
   * Does a cronjob every 1st day of month at noon. The job is:
   * Delete logs from logs database that are older that 33days. Wait 10s, then VACUUM the database to free up space.
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async handleCron() {
    try {
      this.createLog({
        message: 'DB rotation and vacuum cron job.',
        context: LogsService.name,
        level: 'log',
      });

      // Delete old rows
      await this.logsRepository
        .createQueryBuilder('log')
        .delete()
        .from(Log)
        .where(`log.creationDate < date('now', 'utc', '-33 days')`)
        .execute();

      // Sleep 10 seconds
      await new Promise((r) => setTimeout(r, 10000));

      // Vacuum db
      await this.logsRepository.query('VACUUM;');
    } catch (err: unknown) {
      this.createLog({
        message: err as string,
        context: LogsService.name,
        level: 'error',
      });
    }
  }

  /**
   * Creates a log record in the log database.
   * @param log
   * @returns
   */
  async createLog(log: CreateLogDto): Promise<Log> {
    const newLog = await this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }
}

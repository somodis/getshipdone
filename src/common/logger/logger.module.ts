import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Log from 'src/database/log/logs.entity';
import CustomLogger from './customLogger';
import LogsService from './logs.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log], 'logsConnection')],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}

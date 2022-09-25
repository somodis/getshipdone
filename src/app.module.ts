import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validate';
import LogsMiddleware from './common/middleware/logs.middleware';
import DatabaseLogger from './common/logger/databaseLogger';
import Log from './database/log/logs.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../data/db.sqlite'),
      entities: ['dist/database/entity/*.entity{.ts,.js}'],
      logger: new DatabaseLogger(),
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      name: 'logsConnection',
      database: path.resolve(__dirname, '../data/logs.sqlite'),
      entities: [Log],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    TodosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}

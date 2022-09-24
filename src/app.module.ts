import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validate';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../data/db.sqlite'),
      entities: ['dist/database/entity/*.entity{.ts,.js}'],
      logging: process.env.NODE_ENV !== 'production',
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    TodosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabourModule } from './labour/labour.module';
import { AuthModule } from './auth/auth.module';
import { BffModule } from './bff/bff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),

    LabourModule, // Core Domain
    AuthModule,   // Authentication & JWT
    BffModule,    // Backend For Frontend & Chatbot Gateway
  ],
})
export class AppModule {}
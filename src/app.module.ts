import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Post, Tag } from './entities';
import { WebhookModule } from './modules/webhook/webhook.module';
import { CacheModule } from './modules/cache/cache.module';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { WebhookListenerService } from './examples/webhook-listener.service';

@Module({
  imports: [
    // Global configuration modules
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRoot({
      level: 'debug',
      timestamp: true,
    }),

    CacheModule.forRoot({
      ttl: 3600,
      max: 1000,
      isGlobal: true,
    }),

    // Webhook module with dynamic configuration
    WebhookModule.forRoot({
      secret: process.env.WEBHOOK_SECRET || 'dev-secret-key',
      endpoints: [],
      retryAttempts: 3,
      timeout: 5000,
    }),

    // TypeORM configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs_db',
      entities: [User, Post, Tag],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Post, Tag]),
  ],
  providers: [WebhookListenerService],
})
export class AppModule {}

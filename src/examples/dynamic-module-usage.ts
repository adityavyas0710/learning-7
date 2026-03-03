import { Module } from '@nestjs/common';
import { WebhookModule } from '../modules/webhook/webhook.module';
import { CacheModule } from '../modules/cache/cache.module';
import { ConfigModule } from '../modules/config/config.module';
import { LoggerModule } from '../modules/logger/logger.module';
import { WebhookListenerService } from './webhook-listener.service';

@Module({
  imports: [
    // Static configuration
    WebhookModule.forRoot({
      secret: 'your-webhook-secret-key',
      endpoints: ['https://example.com/webhook'],
      retryAttempts: 3,
      timeout: 5000,
    }),

    // Async configuration
    // WebhookModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('webhook.secret'),
    //     endpoints: configService.get('webhook.endpoints'),
    //   }),
    //   inject: [ConfigService],
    // }),

    CacheModule.forRoot({
      ttl: 3600,
      max: 1000,
      isGlobal: true,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRoot({
      level: 'debug',
      timestamp: true,
    }),
  ],
  providers: [WebhookListenerService],
})
export class ExampleModule {}

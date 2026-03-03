import { DynamicModule, Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';

export interface WebhookModuleOptions {
  secret?: string;
  endpoints?: string[];
  retryAttempts?: number;
  timeout?: number;
}

@Module({})
export class WebhookModule {
  static forRoot(options: WebhookModuleOptions): DynamicModule {
    return {
      module: WebhookModule,
      providers: [
        {
          provide: 'WEBHOOK_OPTIONS',
          useValue: options,
        },
        WebhookService,
      ],
      controllers: [WebhookController],
      exports: [WebhookService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<WebhookModuleOptions> | WebhookModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: WebhookModule,
      providers: [
        {
          provide: 'WEBHOOK_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        WebhookService,
      ],
      controllers: [WebhookController],
      exports: [WebhookService],
      global: true,
    };
  }
}

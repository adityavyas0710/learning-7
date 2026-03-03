import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

export interface LoggerModuleOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  timestamp?: boolean;
  context?: string;
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: {
            level: options.level || 'info',
            timestamp: options.timestamp !== false,
            context: options.context || 'App',
          },
        },
        LoggerService,
      ],
      exports: [LoggerService],
      global: true,
    };
  }

  static forFeature(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: (options: LoggerModuleOptions) => {
            return new LoggerService({ ...options, context });
          },
          inject: ['LOGGER_OPTIONS'],
        },
      ],
      exports: [LoggerService],
    };
  }
}

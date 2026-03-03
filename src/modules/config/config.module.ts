import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

export interface ConfigModuleOptions {
  folder?: string;
  envFilePath?: string;
  isGlobal?: boolean;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
      global: options.isGlobal !== false,
    };
  }

  static forFeature(config: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'FEATURE_CONFIG',
          useValue: config,
        },
      ],
      exports: ['FEATURE_CONFIG'],
    };
  }
}

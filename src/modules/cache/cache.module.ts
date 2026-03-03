import { DynamicModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

export interface CacheModuleOptions {
  ttl?: number;
  max?: number;
  isGlobal?: boolean;
}

@Module({})
export class CacheModule {
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: 'CACHE_OPTIONS',
          useValue: {
            ttl: options.ttl || 3600,
            max: options.max || 100,
          },
        },
        CacheService,
      ],
      exports: [CacheService],
      global: options.isGlobal !== false,
    };
  }
}

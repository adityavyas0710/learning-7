import { Injectable, Inject } from '@nestjs/common';
import { ConfigModuleOptions } from './config.module';

@Injectable()
export class ConfigService {
  private readonly config: Map<string, any> = new Map();

  constructor(
    @Inject('CONFIG_OPTIONS')
    private readonly options: ConfigModuleOptions,
  ) {
    this.loadConfig();
  }

  private loadConfig(): void {
    this.config.set('database.host', process.env.DB_HOST || 'localhost');
    this.config.set('database.port', parseInt(process.env.DB_PORT || '5432'));
    this.config.set('database.username', process.env.DB_USERNAME || 'postgres');
    this.config.set('database.password', process.env.DB_PASSWORD || 'postgres');
    this.config.set('database.database', process.env.DB_DATABASE || 'nestjs_db');
  }

  get<T = any>(key: string, defaultValue?: T): T {
    return this.config.get(key) ?? defaultValue;
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  has(key: string): boolean {
    return this.config.has(key);
  }
}

import { Injectable, Inject, LogLevel } from '@nestjs/common';
import { LoggerModuleOptions } from './logger.module';

@Injectable()
export class LoggerService {
  constructor(
    @Inject('LOGGER_OPTIONS')
    private readonly options: LoggerModuleOptions,
  ) {}

  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = this.options.timestamp ? new Date().toISOString() : '';
    const ctx = context || this.options.context;
    return `${timestamp} [${level}] [${ctx}] ${message}`;
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: string): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('ERROR', message, context));
      if (trace) console.error(trace);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.options.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }
}

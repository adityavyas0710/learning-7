import { Injectable, Inject, Logger } from '@nestjs/common';
import { WebhookModuleOptions } from './webhook.module';
import * as crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly subscribers = new Map<string, Set<(payload: WebhookPayload) => void>>();

  constructor(
    @Inject('WEBHOOK_OPTIONS')
    private readonly options: WebhookModuleOptions,
  ) {}

  subscribe(event: string, callback: (payload: WebhookPayload) => void): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    this.logger.log(`Subscribed to event: ${event}`);
  }

  unsubscribe(event: string, callback: (payload: WebhookPayload) => void): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      this.logger.log(`Unsubscribed from event: ${event}`);
    }
  }

  async emit(event: string, data: any): Promise<void> {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp: Date.now(),
    };

    const callbacks = this.subscribers.get(event);
    if (callbacks && callbacks.size > 0) {
      this.logger.log(`Emitting event: ${event} to ${callbacks.size} subscribers`);
      
      for (const callback of callbacks) {
        try {
          await callback(payload);
        } catch (error) {
          this.logger.error(`Error in webhook callback for event ${event}:`, error);
        }
      }
    }

    if (this.options.endpoints && this.options.endpoints.length > 0) {
      await this.sendToEndpoints(payload);
    }
  }

  private async sendToEndpoints(payload: WebhookPayload): Promise<void> {
    const promises = this.options.endpoints.map(endpoint =>
      this.sendWebhook(endpoint, payload)
    );
    await Promise.allSettled(promises);
  }

  private async sendWebhook(url: string, payload: WebhookPayload): Promise<void> {
    const signature = this.generateSignature(payload);
    const retries = this.options.retryAttempts || 3;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.options.timeout || 5000),
        });

        if (response.ok) {
          this.logger.log(`Webhook sent successfully to ${url}`);
          return;
        }
      } catch (error) {
        this.logger.warn(`Webhook attempt ${attempt + 1} failed for ${url}:`, error.message);
        if (attempt === retries - 1) {
          this.logger.error(`All webhook attempts failed for ${url}`);
        }
      }
    }
  }

  generateSignature(payload: WebhookPayload): string {
    if (!this.options.secret) return '';
    
    const hmac = crypto.createHmac('sha256', this.options.secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  verifySignature(payload: WebhookPayload, signature: string): boolean {
    if (!this.options.secret) return true;
    
    const expectedSignature = this.generateSignature(payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

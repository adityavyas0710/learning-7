import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebhookService, WebhookPayload } from '../modules/webhook/webhook.service';

@Injectable()
export class WebhookListenerService implements OnModuleInit {
  constructor(private readonly webhookService: WebhookService) {}

  onModuleInit() {
    this.webhookService.subscribe('user.created', this.handleUserCreated.bind(this));
    this.webhookService.subscribe('post.published', this.handlePostPublished.bind(this));
    this.webhookService.subscribe('payment.completed', this.handlePaymentCompleted.bind(this));
  }

  private async handleUserCreated(payload: WebhookPayload): Promise<void> {
    console.log('User created webhook received:', payload.data);
    // Send welcome email, create user profile, etc.
  }

  private async handlePostPublished(payload: WebhookPayload): Promise<void> {
    console.log('Post published webhook received:', payload.data);
    // Notify followers, update search index, etc.
  }

  private async handlePaymentCompleted(payload: WebhookPayload): Promise<void> {
    console.log('Payment completed webhook received:', payload.data);
    // Update order status, send receipt, etc.
  }
}

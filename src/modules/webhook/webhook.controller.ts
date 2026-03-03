import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { WebhookService, WebhookPayload } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('receive')
  @HttpCode(HttpStatus.OK)
  async receiveWebhook(
    @Body() payload: WebhookPayload,
    @Headers('x-webhook-signature') signature: string,
  ): Promise<{ success: boolean }> {
    if (!this.webhookService.verifySignature(payload, signature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    await this.webhookService.emit(payload.event, payload.data);
    
    return { success: true };
  }

  @Post('trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerWebhook(
    @Body() body: { event: string; data: any },
  ): Promise<{ message: string }> {
    await this.webhookService.emit(body.event, body.data);
    
    return { message: 'Webhook triggered successfully' };
  }
}

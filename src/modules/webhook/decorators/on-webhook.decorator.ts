import { SetMetadata } from '@nestjs/common';

export const ON_WEBHOOK_EVENT = 'onWebhookEvent';

export const OnWebhook = (event: string) => SetMetadata(ON_WEBHOOK_EVENT, event);

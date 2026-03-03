# NestJS Advanced Features

## Dynamic Modules

Dynamic modules allow you to configure modules at runtime with custom options.

### Webhook Module (Dynamic)

```typescript
// Static configuration
WebhookModule.forRoot({
  secret: 'your-secret-key',
  endpoints: ['https://api.example.com/webhook'],
  retryAttempts: 3,
  timeout: 5000,
})

// Async configuration
WebhookModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('webhook.secret'),
    endpoints: configService.get('webhook.endpoints'),
  }),
  inject: [ConfigService],
})
```

### Cache Module

```typescript
CacheModule.forRoot({
  ttl: 3600,      // Time to live in seconds
  max: 1000,      // Maximum cache entries
  isGlobal: true, // Available globally
})
```

### Config Module

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
})
```

### Logger Module

```typescript
LoggerModule.forRoot({
  level: 'debug',
  timestamp: true,
  context: 'App',
})
```

## Webhook System

### Receiving Webhooks

```bash
POST /webhooks/receive
Headers:
  x-webhook-signature: <hmac-sha256-signature>
Body:
{
  "event": "user.created",
  "data": { "userId": "123", "email": "user@example.com" },
  "timestamp": 1234567890
}
```

### Triggering Webhooks

```bash
POST /webhooks/trigger
Body:
{
  "event": "post.published",
  "data": { "postId": "456", "title": "New Post" }
}
```

### Subscribing to Events

```typescript
@Injectable()
export class MyService implements OnModuleInit {
  constructor(private webhookService: WebhookService) {}

  onModuleInit() {
    this.webhookService.subscribe('user.created', async (payload) => {
      console.log('User created:', payload.data);
      // Handle the event
    });
  }
}
```

### Emitting Events

```typescript
await this.webhookService.emit('order.completed', {
  orderId: '789',
  amount: 99.99,
});
```

## Features

- HMAC-SHA256 signature verification
- Automatic retry with configurable attempts
- Timeout handling
- Multiple endpoint support
- Event subscription system
- Type-safe payloads

## Security

Webhooks are secured using HMAC-SHA256 signatures:

1. Server generates signature using secret key
2. Signature sent in `X-Webhook-Signature` header
3. Receiver verifies signature before processing

## Environment Variables

```env
WEBHOOK_SECRET=your-secret-key-here
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs_db
```

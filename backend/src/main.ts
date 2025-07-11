import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
    app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    console.log('[Auth Header]', req.headers.authorization);
    next();
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

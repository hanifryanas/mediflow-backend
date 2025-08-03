import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mediflow API')
    .setDescription('API documentation for the Mediflow application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Mediflow API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .scheme-container { display: none; }
      .swagger-ui .opblock-tag.no-desc span { color: #333; }
      .swagger-ui .opblock-summary-description { display: none; }
    `,
  });

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

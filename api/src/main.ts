import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // https://docs.nestjs.com/techniques/performance#adapter
  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1');

  // https://docs.nestjs.com/security/cors
  app.enableCors();

  // https://docs.nestjs.com/openapi/introduction
  // Hint: To generate and download a Swagger JSON file, navigate to http://localhost:3333/swagger-json
  // (assuming that your Swagger documentation is available under http://localhost:3333/swagger).
  const config = new DocumentBuilder()
    .setTitle('OpenAI Assistant')
    .setDescription('OpenAI Assistant Function Calling')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3333);
}
bootstrap();

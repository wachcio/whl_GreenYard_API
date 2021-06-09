import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // 'local'
  // const app = await NestFactory.create(AppModule, { cors: true });
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  console.log(
    'config: ',
    configService.get('VALIDATION_PIPE_DISABLE_ERROR_MESSAGES'),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // forbidUnknownValues: true,
      skipMissingProperties: true,
      transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
      disableErrorMessages: false,
      validationError: {
        /**
         * WARNING: Avoid exposing the values in the error output (could leak sensitive information)
         */
        value: false,
      },
      // disableErrorMessages: configService.get(
      //   'VALIDATION_PIPE_DISABLE_ERROR_MESSAGES',
      // ),
    }),
  );

  app.setGlobalPrefix('api/v1');
  const options = new DocumentBuilder()
    .setTitle('whl GreenYard')
    .setDescription('Working hours list GreenYard API')
    .setVersion('1.0')
    .addTag('GreenYard')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

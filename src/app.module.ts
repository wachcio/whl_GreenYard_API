import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConsoleModule } from 'nestjs-console';
import { MailModule } from './mail/mail.module';
import { envConfigFilePath } from './utils/env-config-file-path';
import { CronModule } from './cron/cron.module';
import { WorkingHoursModule } from './working-hours/working-hours.module';

@Module({
  imports: [
    envConfigFilePath(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      logging: process.env.TYPEORM_LOGGING as
        | boolean
        | 'all'
        | (
            | 'query'
            | 'schema'
            | 'error'
            | 'warn'
            | 'info'
            | 'log'
            | 'migration'
          )[],
      logger: process.env.TYPEORM_LOGGER as
        | 'debug'
        | 'advanced-console'
        | 'simple-console'
        | 'file',
      synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
      bigNumberStrings: Boolean(process.env.TYPEORM_BIG_NUMBER_STRING),
      // dropSchema: Boolean(process.env.TYPEORM_DROP_SCHEMA),
      // cache: Boolean(process.env.TYPEORM_CACHE),
    }),

    UserModule,
    AuthModule,
    ConsoleModule,
    MailModule,
    CronModule,
    WorkingHoursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { MailService } from './mail.service';
import { envConfigFilePath } from 'src/utils/env-config-file-path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

@Module({
  imports: [
    envConfigFilePath(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        ignoreTLS: Boolean(process.env.MAILER_IGNORE_TLS),
        secure: false,
        auth: {
          user: process.env.MAILER_AUTH_USER,
          pass: process.env.MAILER_AUTH_PASS,
        },
      },
      defaults: {
        from: `"${process.env.MAILER_DEFAULTS_FROM_NAME}" <${process.env.MAILER_DEFAULTS_FROM_ADDRESS}>`,
      },
      template: {
        dir: path.join(__dirname, process.env.MAILER_DIR),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: Boolean(process.env.MAILER_STRICT),
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

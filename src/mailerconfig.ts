import { HandlebarsAdapter } from '@nest-modules/mailer';

export = {
  transport: `smtp://admin123:admin456@localhost:2500`,
  //   transport: process.env.MAILER_TRANSPORT,
  defaults: {
    from: 'admin@test.example.com',
    // from: process.env.MAILER_FROM,
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

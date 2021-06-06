import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { User } from 'src/user/user.entity';

@Injectable()
export class MailService {
  constructor(protected readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendWelcomeMessage({ username, email }: User): Promise<any> {
    const subject = `Rejestracja w Atlasie grzybów`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'welcome',
      context: { username, emailToAdmin: process.env.MAILER_ADDRESS_TO_ADMIN },
    });
  }

  async sendMessageToAdmin({ username, email, id }: User): Promise<any> {
    const subject = `Nowa rejestracja w Atlasie grzybów`;

    await this.mailerService.sendMail({
      to: process.env.MAILER_ADDRESS_TO_ADMIN,
      subject,
      template: 'infoToAdmin',
      context: { username, email, id },
    });
  }

  async sendResetPasswordLink({
    username,
    email,
    resetPasswordToken,
    resetPasswordExpirationDate,
  }: User): Promise<any> {
    const subject = `Link resetu hasła dla ${username}`;
    const resetPasswordLink = `${process.env.APP_DOMAIN}user/resetPassword/${resetPasswordToken}`;

    resetPasswordExpirationDate = resetPasswordExpirationDate.toLocaleString();

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'resetPassword',
      context: {
        username,
        email,
        resetPasswordLink,
        resetPasswordExpirationDate,
      },
    });
  }

  async sendNewPassword(
    { username, email }: User,
    newPassword: string,
  ): Promise<any> {
    const subject = `Nowe hasło dla ${username}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'newPassword',
      context: { username, email, newPassword },
    });
  }
}

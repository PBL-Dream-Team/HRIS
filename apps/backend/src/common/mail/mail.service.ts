import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPassword(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password Link',
      template: './reset-password',
      context: {
        link,
      },
    });
  }
}

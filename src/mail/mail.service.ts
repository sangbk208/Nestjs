import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserVerify(user: IUser, token: string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Shopping cart! verify your account',
      template: 'verifyUser',
      context: {
        name: user.name,
        url,
      },
    });
  }
}

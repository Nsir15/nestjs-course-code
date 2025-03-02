import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('nodemailer_auth_user'), // generated ethereal user
        pass: this.configService.get('nodemailer_auth_pass'), // generated ethereal password
      },
    });
  }

  async sendMail({ to, subject, html }) {
    if (!to) {
      throw new HttpException('邮箱地址不能为空', 400);
    }
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统', // sender address
        address: this.configService.get('nodemailer_auth_user'), // sender address
      },
      to,
      subject,
      html,
    });
  }
}

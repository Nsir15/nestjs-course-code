import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '447108518@qq.com', // generated ethereal user
        pass: 'jnkjhnfqeadfbheb', // generated ethereal password
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '"Fred Foo 👻" <foo@example.com>', // sender address
        address: '447108518@qq.com', // sender address
      },
      to,
      subject,
      html,
    });
  }
}

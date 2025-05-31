import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/app.config';

import { EmployeeModule } from './modules/Employee/employee.module';
import { CompanyModule } from './modules/Company/company.module';
import { SubscriptionModule } from './modules/Company/subscription.module';
import { AttendanceTypeModule } from './modules/Attendance/attendancetype.module';
import { AttendanceModule } from './modules/Attendance/attendance.module';
import { AbsenceModule } from './modules/Attendance/absence.module';
import { LetterModule } from './modules/Lettering/letter.module';
import { LetterTypeModule } from './modules/Lettering/lettertype.module';
import { AuthModule } from './modules/Auth/auth.module';
import { TransactionModule } from './modules/Company/transaction.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PaymentModule } from './modules/Company/payment.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"HRIS" <no-reply@example.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    EmployeeModule,
    CompanyModule,
    SubscriptionModule,
    AttendanceModule,
    AttendanceTypeModule,
    AbsenceModule,
    LetterModule,
    LetterTypeModule,
    AuthModule,
    TransactionModule,
    PaymentModule
  ],
})
export class AppModule {}

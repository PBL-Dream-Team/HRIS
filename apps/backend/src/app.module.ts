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

@Module({
  imports: [
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
    TransactionModule
  ],
})
export class AppModule {}

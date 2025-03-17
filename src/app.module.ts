import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SalaryModule } from './modules/salary/salary.module';
import { LetterModule } from './modules/letter/letter.module';
import { LetterFormatModule } from './modules/letterFormat/letterFormat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true}),
    PrismaModule,
    UserModule,
    PaymentModule,
    EmployeeModule,
    SalaryModule,
    LetterModule,
    LetterFormatModule
  ],
})

export class AppModule {}

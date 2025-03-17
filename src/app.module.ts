import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SalaryModule } from './modules/salary/salary.module';
import { LetterModule } from './modules/letter/letter.module';
import { LetterFormatModule } from './modules/letterFormat/letterFormat.module';
import { CheckClockModule } from './modules/checkclock/checkclock.module';
import { CheckClockSettingModule } from './modules/checkclocksetting/checkclocksetting.module';
import { CheckClockSettingTimeModule } from './modules/checkclocksettingtime/checkclocksettingtime.module';
import configuration from './config/app.config';
import { SubsModule } from './modules/subscription/subs.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    PaymentModule,
    EmployeeModule,
    SalaryModule,
    LetterModule,
    LetterFormatModule,
    CheckClockModule,
    CheckClockSettingModule,
    CheckClockSettingTimeModule,
    SubsModule,
    WorkspaceModule
  ],
})
export class AppModule {}

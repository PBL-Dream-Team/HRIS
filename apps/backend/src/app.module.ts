import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

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
    WorkspaceModule,
  ],
})
export class AppModule {}

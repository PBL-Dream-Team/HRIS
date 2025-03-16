import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from "./config/app.config";
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[configuration],
      isGlobal:true}),
    PrismaModule,
    UserModule
  ],
})
export class AppModule {}

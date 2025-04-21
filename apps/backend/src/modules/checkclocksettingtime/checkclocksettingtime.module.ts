import { Module } from '@nestjs/common';
import { CheckClockSettingTimeService } from './checkclocksettingtime.service';
import { CheckClockSettingTimeController } from './checkclocksettingtime.controller';

@Module({
  providers: [CheckClockSettingTimeService],
  controllers: [CheckClockSettingTimeController],
})
export class CheckClockSettingTimeModule {}

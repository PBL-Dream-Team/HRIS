import { Module } from '@nestjs/common';
import { CheckClockService } from './checkclock.service';
import { CheckClockController } from './checkclock.controller';

@Module({
  providers: [CheckClockService],
  controllers: [CheckClockController],
})
export class CheckClockModule {}

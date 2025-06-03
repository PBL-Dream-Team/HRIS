import { Module } from '@nestjs/common';
import { TripayController } from './tripay.controller';
import { TripayService } from './tripay.service';

@Module({
  controllers: [TripayController],
  providers: [TripayService],
})
export class TripayModule {}

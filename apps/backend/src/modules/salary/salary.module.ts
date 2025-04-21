import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';

@Module({
  providers: [SalaryService],
  controllers: [SalaryController],
})
export class SalaryModule {}

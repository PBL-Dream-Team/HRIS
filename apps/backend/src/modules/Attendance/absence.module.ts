import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';

@Module({
  providers: [AbsenceService],
  controllers: [AbsenceController],
})
export class AbsenceModule {}

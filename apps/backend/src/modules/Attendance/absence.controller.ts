import {Controller,Get,Post,Body,Param,Delete,Patch,} from '@nestjs/common';
import { createAbsenceDto } from './dtos/createAbsence.dto';
import { editAbsenceDto } from './dtos/editAbsence.dto';
import { AbsenceService } from './absence.service';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly AbsenceService: AbsenceService) {}

  @Post()
  createAbsence(@Body() createAbsenceDto: createAbsenceDto) {
    return this.AbsenceService.createAbsence(createAbsenceDto);
  }

  @Get()
  getAbsences() {
    return this.AbsenceService.getAbsences();
  }

  @Get(':id')
  getAbsence(@Param('id') absenceId: string) {
    return this.AbsenceService.getAbsence(absenceId);
  }

  @Patch(':id')
  updateAbsence(
    @Param('id') absenceId: string,
    @Body() updateAbsenceDto: editAbsenceDto,
  ) {
    return this.AbsenceService.updateAbsence(absenceId, updateAbsenceDto);
  }

  @Delete(':id')
  deleteAbsence(@Param('id') absenceId: string) {
    return this.AbsenceService.deleteAbsence(absenceId);
  }
}
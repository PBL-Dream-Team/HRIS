import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';
import { AttendanceService } from './attendance.service';
import { JwtGuard } from '../Auth/guard';

@UseGuards(JwtGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly AttendanceService: AttendanceService) {}

  @Post()
  createAttendance(@Body() createAttendanceDto: createAttendanceDto) {
    return this.AttendanceService.createAttendance(createAttendanceDto);
  }

  @Get()
  getAttendances() {
    return this.AttendanceService.getAttendances();
  }

  @Get(':id')
  getAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.getAttendance(attendanceId);
  }

  @Patch(':id')
  updateAttendance(
    @Param('id') attendanceId: string,
    @Body() updateAttendanceDto: editAttendanceDto,
  ) {
    return this.AttendanceService.updateAttendance(attendanceId, updateAttendanceDto);
  }

  @Delete(':id')
  deleteAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.deleteAttendance(attendanceId);
  }
}
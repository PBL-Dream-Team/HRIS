import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';
import { AttendanceService } from './attendance.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("attendance")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly AttendanceService: AttendanceService) {}

  @Post()
  @ApiBody({type:createAttendanceDto})
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
  @ApiBody({type:editAttendanceDto})
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
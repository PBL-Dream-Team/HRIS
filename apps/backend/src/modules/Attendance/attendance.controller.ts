import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';
import { AttendanceService } from './attendance.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('attendance')
@UseGuards(JwtGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly AttendanceService: AttendanceService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: createAttendanceDto })
  createAttendance(@Body() createAttendanceDto: createAttendanceDto) {
    return this.AttendanceService.createAttendance(createAttendanceDto);
  }

  @Get()
  getAttendances(@Query() query: Record<string, any>) {
    if (Object.keys(query).length > 0) {
      return this.AttendanceService.findFilters(query);
    }
    return this.AttendanceService.getAttendances();
  }

  @Get(':id')
  getAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.getAttendance(attendanceId);
  }

  @Patch(':id')
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: editAttendanceDto })
  updateAttendance(
    @Param('id') attendanceId: string,
    @Body() updateAttendanceDto: editAttendanceDto,
  ) {
    return this.AttendanceService.updateAttendance(
      attendanceId,
      updateAttendanceDto,
    );
  }

  @Delete(':id')
  @UseGuards(SubscriptionGuard)
  deleteAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.deleteAttendance(attendanceId);
  }

  @Get(':id/work-info')
  async getWorkInformation(
    @Param('id') id: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.AttendanceService.getMonthlyWorkInfo(id, month, year);
  }
}

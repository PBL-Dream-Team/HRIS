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
import { createAttendanceTypeDto } from './dtos/createAttendanceType.dto';
import { editAttendanceTypeDto } from './dtos/editAttendanceType.dto';
import { AttendanceTypeService } from './attendanceType.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('attendancetype')
@UseGuards(JwtGuard)
@Controller('api/attendanceType')
export class AttendanceTypeController {
  constructor(private readonly AttendanceTypeService: AttendanceTypeService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: createAttendanceTypeDto })
  createAttendanceType(
    @Body() createAttendanceTypeDto: createAttendanceTypeDto,
  ) {
    return this.AttendanceTypeService.createAttendanceType(
      createAttendanceTypeDto,
    );
  }

  @Get()
  getAttendanceTypes(@Query() query: Record<string, any>) {
    if (Object.keys(query).length > 0) {
      return this.AttendanceTypeService.findFilters(query);
    }
    return this.AttendanceTypeService.getAttendanceTypes();
  }

  @Get(':id')
  getAttendanceType(@Param('id') attendanceTypeId: string) {
    return this.AttendanceTypeService.getAttendanceType(attendanceTypeId);
  }

  @Patch(':id')
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: editAttendanceTypeDto })
  updateAttendanceType(
    @Param('id') attendanceTypeId: string,
    @Body() updateAttendanceTypeDto: editAttendanceTypeDto,
  ) {
    return this.AttendanceTypeService.updateAttendanceType(
      attendanceTypeId,
      updateAttendanceTypeDto,
    );
  }

  @Delete(':id')
  @UseGuards(SubscriptionGuard)
  deleteAttendanceType(@Param('id') attendanceTypeId: string) {
    return this.AttendanceTypeService.deleteAttendanceType(attendanceTypeId);
  }
}

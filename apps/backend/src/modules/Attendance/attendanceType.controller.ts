import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createAttendanceTypeDto } from './dtos/createAttendanceType.dto';
import { editAttendanceTypeDto } from './dtos/editAttendanceType.dto';
import { AttendanceTypeService } from './attendanceType.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("attendancetype")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/attendanceType')
export class AttendanceTypeController {
  constructor(private readonly AttendanceTypeService: AttendanceTypeService) {}

  @Post()
  @ApiBody({type:createAttendanceTypeDto})
  createAttendanceType(@Body() createAttendanceTypeDto: createAttendanceTypeDto) {
    return this.AttendanceTypeService.createAttendanceType(createAttendanceTypeDto);
  }

  @Get()
  getAttendanceTypes() {
    return this.AttendanceTypeService.getAttendanceTypes();
  }

  @Get(':id')
  getAttendanceType(@Param('id') attendanceTypeId: string) {
    return this.AttendanceTypeService.getAttendanceType(attendanceTypeId);
  }

  @Patch(':id')
  @ApiBody({type:editAttendanceTypeDto})
  updateAttendanceType(
    @Param('id') attendanceTypeId: string,
    @Body() updateAttendanceTypeDto: editAttendanceTypeDto,
  ) {
    return this.AttendanceTypeService.updateAttendanceType(attendanceTypeId, updateAttendanceTypeDto);
  }

  @Delete(':id')
  deleteAttendanceType(@Param('id') attendanceTypeId: string) {
    return this.AttendanceTypeService.deleteAttendanceType(attendanceTypeId);
  }
}
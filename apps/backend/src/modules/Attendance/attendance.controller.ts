import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards, Query, UploadedFile, UseInterceptors,} from '@nestjs/common';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';
import { AttendanceService } from './attendance.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadExtensionInterceptor } from '../../multer/image_upload.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("attendance")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly AttendanceService: AttendanceService) {}

  @Post()
  @ApiBody({type:createAttendanceDto})
  @UseInterceptors(
        FileInterceptor('file',{
          limits: { fileSize: 50 * 1024 * 1024},
        }),
        new UploadExtensionInterceptor(['jpg','jpeg','png','pdf'])
      )
  createAttendance(@Body() createAttendanceDto: createAttendanceDto,
 @UploadedFile() file: Express.Multer.File) {
    return this.AttendanceService.createAttendance(createAttendanceDto);
  }

  @Get()
  getAttendances(@Query() query: Record<string,any>) {
      if(Object.keys(query).length >0){
          return this.AttendanceService.findFilters(query);
      }
      return this.AttendanceService.getAttendances();
    }

  @Get(':id')
  getAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.getAttendance(attendanceId);
  }

  @Patch(':id')
  @ApiBody({type:editAttendanceDto})
  @UseInterceptors(
      FileInterceptor('file',{
        limits: { fileSize: 50 * 1024 * 1024},
      }),
      new UploadExtensionInterceptor(['jpg','jpeg','png','pdf'])
    )
  updateAttendance(
    @Param('id') attendanceId: string,
    @Body() updateAttendanceDto: editAttendanceDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.AttendanceService.updateAttendance(attendanceId, updateAttendanceDto);
  }

  @Delete(':id')
  deleteAttendance(@Param('id') attendanceId: string) {
    return this.AttendanceService.deleteAttendance(attendanceId);
  }
}
import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards, Query, UseInterceptors, UploadedFile,} from '@nestjs/common';
import { createAbsenceDto } from './dtos/createAbsence.dto';
import { editAbsenceDto } from './dtos/editAbsence.dto';
import { AbsenceService } from './absence.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadExtensionInterceptor } from '../../multer/image_upload.interceptor';

@ApiTags("absence")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/absence')
export class AbsenceController {
  constructor(private readonly AbsenceService: AbsenceService) {}

  @Post()
  @ApiBody({type:createAbsenceDto})
  @UseInterceptors(
      FileInterceptor('file',{
        limits: { fileSize: 50 * 1024 * 1024},
      }),
      new UploadExtensionInterceptor(['jpg','jpeg','png','pdf'])
    )
  createAbsence(
    @Body() createAbsenceDto: createAbsenceDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.AbsenceService.createAbsence(createAbsenceDto, file);
  }

  @Get()
  getAbsences(@Query() query: Record<string,any>) {
    if(Object.keys(query).length >0){
        return this.AbsenceService.findFilters(query);
    }
    return this.AbsenceService.getAbsences();
  }

  @Get(':id')

  getAbsence(@Param('id') absenceId: string) {
    return this.AbsenceService.getAbsence(absenceId);
  }

  @Patch(':id')
  @ApiBody({type:editAbsenceDto})
  @UseInterceptors(
      FileInterceptor('file',{
        limits: { fileSize: 50 * 1024 * 1024},
      }),
      new UploadExtensionInterceptor(['jpg','jpeg','png','pdf'])
    )
  updateAbsence(
    @Param('id') absenceId: string,
    @Body() updateAbsenceDto: editAbsenceDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.AbsenceService.updateAbsence(absenceId, updateAbsenceDto, file);
  }

  @Delete(':id')
  deleteAbsence(@Param('id') absenceId: string) {
    return this.AbsenceService.deleteAbsence(absenceId);
  }
}
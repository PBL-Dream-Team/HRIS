import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards, Query, UseInterceptors, UploadedFile,} from '@nestjs/common';
import { createLetterDto } from './dtos/createLetter.dto';
import { editLetterDto } from './dtos/editLetter.dto';
import { LetterService } from './letter.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadExtensionInterceptor } from '../../multer/image_upload.interceptor';

@ApiTags('letter')
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/letter')
export class LetterController {
  constructor(private readonly LetterService: LetterService) {}

  @Post()
  @ApiBody({type:createLetterDto})
  @UseInterceptors(
      FileInterceptor('file',{
        limits: { fileSize: 50 * 1024 * 1024},
      }),
      new UploadExtensionInterceptor(['pdf','docx','doc'])
    )
  createLetter(
    @Body() createLetterDto: createLetterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.LetterService.createLetter(createLetterDto, file);
  }

  @Get()
  getLetters(@Query() query: Record<string,any>) {
      if(Object.keys(query).length >0){
          return this.LetterService.findFilters(query);
      }
      return this.LetterService.getLetters();
    }

  @Get(':id')
  getLetter(@Param('id') letterId: string) {
    return this.LetterService.getLetter(letterId);
  }

  @Patch(':id')
  @ApiBody({type:editLetterDto})
  @UseInterceptors(
      FileInterceptor('file',{
        limits: { fileSize: 50 * 1024 * 1024},
      }),
      new UploadExtensionInterceptor(['pdf','docx','doc'])
    )
  updateLetter(
    @Param('id') letterId: string,
    @Body() updateLetterDto: editLetterDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.LetterService.updateLetter(letterId, updateLetterDto, file);
  }

  @Delete(':id')
  deleteLetter(@Param('id') letterId: string) {
    return this.LetterService.deleteLetter(letterId);
  }
}
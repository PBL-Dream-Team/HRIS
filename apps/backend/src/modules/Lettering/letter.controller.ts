import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createLetterDto } from './dtos/createLetter.dto';
import { editLetterDto } from './dtos/editLetter.dto';
import { LetterService } from './letter.service';
import { JwtGuard } from '../Auth/guard';

@UseGuards(JwtGuard)
@Controller('api/letter')
export class LetterController {
  constructor(private readonly LetterService: LetterService) {}

  @Post()
  createLetter(@Body() createLetterDto: createLetterDto) {
    return this.LetterService.createLetter(createLetterDto);
  }

  @Get()
  getLetters() {
    return this.LetterService.getLetters();
  }

  @Get(':id')
  getLetter(@Param('id') letterId: string) {
    return this.LetterService.getLetter(letterId);
  }

  @Patch(':id')
  updateLetter(
    @Param('id') letterId: string,
    @Body() updateLetterDto: editLetterDto,
  ) {
    return this.LetterService.updateLetter(letterId, updateLetterDto);
  }

  @Delete(':id')
  deleteLetter(@Param('id') letterId: string) {
    return this.LetterService.deleteLetter(letterId);
  }
}
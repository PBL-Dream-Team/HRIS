import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards, Query,} from '@nestjs/common';
import { createLetterDto } from './dtos/createLetter.dto';
import { editLetterDto } from './dtos/editLetter.dto';
import { LetterService } from './letter.service';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('letter')
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/letter')
export class LetterController {
  constructor(private readonly LetterService: LetterService) {}

  @Post()
  @ApiBody({type:createLetterDto})
  createLetter(@Body() createLetterDto: createLetterDto) {
    return this.LetterService.createLetter(createLetterDto);
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
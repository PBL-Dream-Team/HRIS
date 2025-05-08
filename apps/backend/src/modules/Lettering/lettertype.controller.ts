import {Controller,Get,Post,Body,Param,Delete,Patch,} from '@nestjs/common';
import { createLetterTypeDto } from './dtos/createLetterType.dto';
import { editLetterTypeDto } from './dtos/editLetterType.dto';
import { LetterTypeService } from './lettertype.service';

@Controller('letterType')
export class LetterTypeController {
  constructor(private readonly LetterTypeService: LetterTypeService) {}

  @Post()
  createLetterType(@Body() createLetterTypeDto: createLetterTypeDto) {
    return this.LetterTypeService.createLetterType(createLetterTypeDto);
  }

  @Get()
  getLetterTypes() {
    return this.LetterTypeService.getLetterTypes();
  }

  @Get(':id')
  getLetterType(@Param('id') letterTypeId: string) {
    return this.LetterTypeService.getLetterType(letterTypeId);
  }

  @Patch(':id')
  updateLetterType(
    @Param('id') letterTypeId: string,
    @Body() updateLetterTypeDto: editLetterTypeDto,
  ) {
    return this.LetterTypeService.updateLetterType(letterTypeId, updateLetterTypeDto);
  }

  @Delete(':id')
  deleteLetterType(@Param('id') letterTypeId: string) {
    return this.LetterTypeService.deleteLetterType(letterTypeId);
  }
}
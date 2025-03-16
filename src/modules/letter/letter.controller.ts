import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto, EditLetterDto } from './dto';

@Controller('letters')
export class LetterController {
    constructor(private letterService: LetterService) {}

    @Post()
    create(@Body() dto: CreateLetterDto) {
        return this.letterService.createLetter(dto);
    }

    @Get()
    getAll() {
        return this.letterService.getLetters();
    }

    @Get(':id')
    getOne(@Param('id') letterId: string) {
        return this.letterService.getLetter(letterId);
    }

    @Put(':id')
    update(@Param('id') letterId: string, @Body() dto: EditLetterDto) {
        return this.letterService.updateLetter(letterId, dto);
    }

    @Delete(':id')
    delete(@Param('id') letterId: string) {
        return this.letterService.deleteLetter(letterId);
    }
}

import { Controller, Post, Get, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto, EditLetterDto } from './dto';

@Controller('letters')
export class LetterController {
    constructor(private letterService: LetterService) {}

    @Post()
    createLetter(@Body() dto: CreateLetterDto) {
        return this.letterService.createLetter(dto);
    }

    @Get()
    getAll() {
        return this.letterService.getLetters();
    }

    @Get(':id')
    getLetter(@Param('id') letterId: string) {
        return this.letterService.getLetter(letterId);
    }

    @Patch(':id')
    updateLetter(@Param('id') letterId: string, 
    @Body() dto: EditLetterDto
    ) {
        return this.letterService.updateLetter(letterId, dto);
    }

    @Delete(':id')
    deleteLetter(@Param('id') letterId: string) {
        return this.letterService.deleteLetter(letterId);
    }
}

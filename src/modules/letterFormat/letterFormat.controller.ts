import { Controller, Post, Get, Put, Delete, Param, Body } from "@nestjs/common";
import { LetterFormatService } from "src/modules/letterFormat/letterFormat.service";
import { CreateLetterFormatDto, editLetterFormatDto, EditLetterFormatDto } from "./dto";


@Controller('letter-format')
export class LetterFormatController {
    constructor(private letterFormatService: LetterFormatService) {}

    @Post()
    create(@Body() dto: CreateLetterFormatDto) {
        return this.letterFormatService.createLetterFormat(dto);
    }

    @Get(':id')
    getLetterFormat(@Param('id') letterFormatId: string){
        return this.letterFormatService.getLetterFormat(letterFormatId);
    }
    
    @Get()
    getLetterFormats() {
        return this.letterFormatService.getLetterFormats();
    }

    @Patch(':id')
    editLetterFormat(@Param('id') letterFormatId: string, @Body() dto: editLetterFormatDto){
        return this.letterFormatService.updateLetterFormat(letterFormatId, dto);
    }

    @Delete(':id')
    deleteLetterFormat(@Param('id') letterFormatId: string){
        return this.letterFormatService.deleteLetterFormat(letterFormatId);
    }
}
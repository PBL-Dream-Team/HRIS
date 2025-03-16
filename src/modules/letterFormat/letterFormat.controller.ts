import { Controller, Post, Get, Put, Delete, Param, Body } from "@nestjs/common";
import { LetterFormatService } from "src/modules/letterFormat/letterFormat.service";
import { CreateLetterFormatDto, EditLetterFormatDto } from "./dto";

@Controller('letter-formats')
export class LetterFormatController {
    constructor(private letterFormatService: LetterFormatService) {}

    @Post()
    create(@Body() dto: CreateLetterFormatDto) {
        return this.letterFormatService.createLetterFormat(dto);
    }

    @Get()
    getAll() {
        return this.letterFormatService.getLetterFormats();
    }

    @Get(':id')



    getOne(@Param('id') letterFormatId: string) {
        return this.letterFormatService.getLetterFormat(letterFormatId);
    }

    @Put(':id')
    update(@Param('id') letterFormatId: string, @Body() dto: EditLetterFormatDto) {
        return this.letterFormatService.updateLetterFormat(letterFormatId, dto);
    }

    @Delete(':id')
    delete(@Param('id') letterFormatId: string) {
        return this.letterFormatService.deleteLetterFormat(letterFormatId);
    }

}

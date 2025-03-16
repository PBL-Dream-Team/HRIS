import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CheckClockService } from "./checkclock.service";
import { createCheckClockDto, editCheckClockDto } from "./dto";

@Controller('checkclocks')
export class CheckClockController {
    constructor(private readonly checkclockService: CheckClockService) {}
    
    @Post()
    createCheckClock(@Body() createCheckClockDto: createCheckClockDto) {
        return this.checkclockService.createCheckClock(createCheckClockDto);
    }

    @Get()
    getCheckClocks() {
        return this.checkclockService.getCheckClocks();
    }

    @Get(':id')
    getCheckClock(@Param('id') checkclockId: string) {
        return this.checkclockService.getCheckClock(checkclockId);
    }

    @Patch(':id')
    updateCheckClock(
        @Param('id') checkclockId: string,
        @Body() updateCheckClockDto: editCheckClockDto
    ){
        return this.checkclockService.updateCheckClock(checkclockId, updateCheckClockDto);
    }

    @Delete(':id')
    deleteCheckClock(
        @Param('id') checkclockId: string
    ) {
        return this.checkclockService.deleteCheckClock(checkclockId);
    }
}
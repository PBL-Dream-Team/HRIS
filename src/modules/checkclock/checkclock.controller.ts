import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CheckClockService } from "./checkclock.service";
import { createCheckClockDto, editCheckClockDto } from "./dto";

@Controller('checkclock')
export class CheckClockController {
    constructor(private readonly checkClockService: CheckClockService) {}
    
    @Post()
    createCheckClock(@Body() createCheckClockDto: createCheckClockDto) {
        return this.checkClockService.createCheckClock(createCheckClockDto);
    }

    @Get()
    getCheckClocks() {
        return this.checkClockService.getCheckClocks();
    }

    @Get(':id')
    getCheckClock(@Param('id') checkClockId: string) {
        return this.checkClockService.getCheckClock(checkClockId);
    }

    @Patch(':id')
    updateCheckClock(
        @Param('id') checkClockId: string,
        @Body() updateCheckClockDto: editCheckClockDto
    ){
        return this.checkClockService.updateCheckClock(checkClockId, updateCheckClockDto);
    }

    @Delete(':id')
    deleteCheckClock(
        @Param('id') checkClockId: string
    ) {
        return this.checkClockService.deleteCheckClock(checkClockId);
    }
}
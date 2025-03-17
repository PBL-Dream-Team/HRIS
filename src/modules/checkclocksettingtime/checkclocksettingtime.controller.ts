import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CheckClockSettingTimeService } from "./checkclocksettingtime.service";
import { createCheckClockSettingTimeDto, editCheckClockSettingTimeDto } from "./dto";

@Controller('checkclocksettingtimes')
export class CheckClockSettingTimeController {
    constructor(private readonly checkClockSettingTimeService: CheckClockSettingTimeService) {}
    
    @Post()
    createCheckClockSettingTime(@Body() createCheckClockSettingTimeDto: createCheckClockSettingTimeDto) {
        return this.checkClockSettingTimeService.createCheckClockSettingTime(createCheckClockSettingTimeDto);
    }

    @Get()
    getCheckClockSettingTimes() {
        return this.checkClockSettingTimeService.getCheckClockSettingTimes();
    }

    @Get(':id')
    getCheckClockSettingTime(@Param('id') checkClockSettingTimeId: string) {
        return this.checkClockSettingTimeService.getCheckClockSettingTime(checkClockSettingTimeId);
    }

    @Patch(':id')
    updateCheckClockSettingTime(
        @Param('id') checkClockSettingTimeId: string,
        @Body() updateCheckClockSettingTimeDto: editCheckClockSettingTimeDto
    ){
        return this.checkClockSettingTimeService.updateCheckClockSettingTime(checkClockSettingTimeId, updateCheckClockSettingTimeDto);
    }

    @Delete(':id')
    deleteCheckClockSettingTime(
        @Param('id') checkClockSettingTimeId: string
    ) {
        return this.checkClockSettingTimeService.deleteCheckClockSettingTime(checkClockSettingTimeId);
    }
}
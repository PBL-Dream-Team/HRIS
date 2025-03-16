import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CheckClockSettingTimeService } from "./checkclocksettingtime.service";
import { createCheckClockSettingTimeDto, editCheckClockSettingTimeDto } from "./dto";

@Controller('checkclocksettingtimes')
export class CheckClockSettingTimeController {
    constructor(private readonly checkclocksettingtimeService: CheckClockSettingTimeService) {}
    
    @Post()
    createCheckClockSettingTime(@Body() createCheckClockSettingTimeDto: createCheckClockSettingTimeDto) {
        return this.checkclocksettingtimeService.createCheckClockSettingTime(createCheckClockSettingTimeDto);
    }

    @Get()
    getCheckClockSettingTimes() {
        return this.checkclocksettingtimeService.getCheckClockSettingTimes();
    }

    @Get(':id')
    getCheckClockSettingTime(@Param('id') checkclocksettingtimeId: string) {
        return this.checkclocksettingtimeService.getCheckClockSettingTime(checkclocksettingtimeId);
    }

    @Patch(':id')
    updateCheckClockSettingTime(
        @Param('id') checkclocksettingtimeId: string,
        @Body() updateCheckClockSettingTimeDto: editCheckClockSettingTimeDto
    ){
        return this.checkclocksettingtimeService.updateCheckClockSettingTime(checkclocksettingtimeId, updateCheckClockSettingTimeDto);
    }

    @Delete(':id')
    deleteCheckClockSettingTime(
        @Param('id') checkclocksettingtimeId: string
    ) {
        return this.checkclocksettingtimeService.deleteCheckClockSettingTime(checkclocksettingtimeId);
    }
}
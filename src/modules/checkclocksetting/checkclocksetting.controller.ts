import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CheckClockSettingService } from "./checkclocksetting.service";
import { createCheckClockSettingDto, editCheckClockSettingDto } from "./dto";

@Controller('checkclocksettings')
export class CheckClockSettingController {
    constructor(private readonly checkclocksettingService: CheckClockSettingService) {}
    
    @Post()
    createCheckClockSetting(@Body() createCheckClockSettingDto: createCheckClockSettingDto) {
        return this.checkclocksettingService.createCheckClockSetting(createCheckClockSettingDto);
    }

    @Get()
    getCheckClockSettings() {
        return this.checkclocksettingService.getCheckClockSettings();
    }

    @Get(':id')
    getCheckClockSetting(@Param('id') checkclocksettingId: string) {
        return this.checkclocksettingService.getCheckClockSetting(checkclocksettingId);
    }

    @Patch(':id')
    updateCheckClockSetting(
        @Param('id') checkclocksettingId: string,
        @Body() updateCheckClockSettingDto: editCheckClockSettingDto
    ){
        return this.checkclocksettingService.updateCheckClockSetting(checkclocksettingId, updateCheckClockSettingDto);
    }

    @Delete(':id')
    deleteCheckClockSetting(
        @Param('id') checkclocksettingId: string
    ) {
        return this.checkclocksettingService.deleteCheckClockSetting(checkclocksettingId);
    }
}
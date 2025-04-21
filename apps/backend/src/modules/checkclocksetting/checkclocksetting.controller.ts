import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CheckClockSettingService } from './checkclocksetting.service';
import { createCheckClockSettingDto, editCheckClockSettingDto } from './dto';

@Controller('checkclocksettings')
export class CheckClockSettingController {
  constructor(
    private readonly checkClocksettingService: CheckClockSettingService,
  ) {}

  @Post()
  createCheckClockSetting(
    @Body() createCheckClockSettingDto: createCheckClockSettingDto,
  ) {
    return this.checkClocksettingService.createCheckClockSetting(
      createCheckClockSettingDto,
    );
  }

  @Get()
  getCheckClockSettings() {
    return this.checkClocksettingService.getCheckClockSettings();
  }

  @Get(':id')
  getCheckClockSetting(@Param('id') checkClocksettingId: string) {
    return this.checkClocksettingService.getCheckClockSetting(
      checkClocksettingId,
    );
  }

  @Patch(':id')
  updateCheckClockSetting(
    @Param('id') checkClocksettingId: string,
    @Body() updateCheckClockSettingDto: editCheckClockSettingDto,
  ) {
    return this.checkClocksettingService.updateCheckClockSetting(
      checkClocksettingId,
      updateCheckClockSettingDto,
    );
  }

  @Delete(':id')
  deleteCheckClockSetting(@Param('id') checkClocksettingId: string) {
    return this.checkClocksettingService.deleteCheckClockSetting(
      checkClocksettingId,
    );
  }
}

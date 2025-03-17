import { Module } from "@nestjs/common";
import { CheckClockSettingService } from "./checkclocksetting.service";
import { CheckClockSettingController } from "./checkclocksetting.controller";

@Module({
    providers: [CheckClockSettingService],
    controllers: [CheckClockSettingController]
})

export class CheckClockSettingModule {}
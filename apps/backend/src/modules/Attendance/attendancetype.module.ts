import { Module } from "@nestjs/common";
import { AttendanceTypeService } from "./attendanceType.service";
import { AttendanceTypeController } from "./attendanceType.controller";

@Module({
    providers:[AttendanceTypeService],
    controllers:[AttendanceTypeController]
})
export class AttendanceTypeModule {}
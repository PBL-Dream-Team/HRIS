import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createCheckClockSettingDto, editCheckClockSettingDto } from "./dto";

@Injectable()
export class CheckClockSettingService {
    constructor(private prisma: PrismaService) {}

    async createCheckClockSetting(dto: createCheckClockSettingDto) {
        try {
            const checkClockSetting = await this.prisma.checkClocksSetting.create({ data: dto });
            return {
                statusCode: 201,
                message: "Check Clock Setting created successfully",
                data: checkClockSetting
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getCheckClockSetting(checkClockSettingId: string) {
        const data = await this.prisma.checkClocksSetting.findFirst({ where: { id: checkClockSettingId } });
        if (data) {
            return {
                statusCode: 200,
                message: "Check Clock Setting found",
                data: data
            };
        } else {
            return {
                statusCode: 404,
                message: "Check Clock Setting not found"
            };
        }
    }

    async getCheckClockSettings() {
        return await this.prisma.checkClocksSetting.findMany();
    }

    async updateCheckClockSetting(checkClockSettingId: string, dto: editCheckClockSettingDto) {
        
        try {
            const checkClockSetting = await this.prisma.checkClocksSetting.update({ where: { id: checkClockSettingId }, data: dto });
            return {
                statusCode: 200,
                message: "Check Clock Setting updated successfully",
                data: checkClockSetting
            }
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteCheckClockSetting(checkClockSettingId: string) {
        try {
            await this.prisma.checkClocksSetting.delete({ where: { id: checkClockSettingId } });
            return {
                statusCode: 200,
                message: "Check Clock Setting deleted successfully"
            };
        } catch (error) {
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
}
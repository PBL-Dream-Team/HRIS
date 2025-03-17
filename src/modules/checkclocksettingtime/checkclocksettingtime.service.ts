import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createCheckClockSettingTimeDto, editCheckClockSettingTimeDto } from "./dto";

@Injectable()
export class CheckClockSettingTimeService {
    constructor(private prisma: PrismaService) {}

    async createCheckClockSettingTime(dto: createCheckClockSettingTimeDto) {
        let data : any = { ...dto };
        try {
            const checkClockSettingTime = await this.prisma.checkClockSettingTime.create({ data: data });
            return {
                statusCode: 201,
                message: "Check Clock Setting Time created successfully",
                data: checkClockSettingTime
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getCheckClockSettingTime(checkClockSettingTimeId: string) {
        const data = await this.prisma.checkClockSettingTime.findFirst({ where: { id: checkClockSettingTimeId } });
        if (data) {
            return {
                statusCode: 200,
                message: "Check Clock Setting Time found",
                data: data
            };
        } else {
            return {
                statusCode: 404,
                message: "Check Clock Setting Time not found"
            };
        }
    }

    async getCheckClockSettingTimes() {
        return await this.prisma.checkClockSettingTime.findMany();
    }

    async updateCheckClockSettingTime(checkClockSettingTimeId: string, dto: editCheckClockSettingTimeDto) {
        try {
            const checkClockSettingTime = await this.prisma.checkClockSettingTime.update({ where: { id: checkClockSettingTimeId }, data: dto });
            return {
                statusCode: 200,
                message: "Check Clock Setting Time updated successfully",
                data: checkClockSettingTime
            }
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteCheckClockSettingTime(checkClockSettingTimeId: string) {
        try {
            await this.prisma.checkClockSettingTime.delete({ where: { id: checkClockSettingTimeId } });
            return {
                statusCode: 200,
                message: "Check Clock Setting Time deleted successfully"
            };
        } catch (error) {
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
}
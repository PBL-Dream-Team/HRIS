import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createCheckClockDto, editCheckClockDto } from "./dto";

@Injectable()
export class CheckClockService {
    constructor(private prisma: PrismaService) {}

    async createCheckClock(dto: createCheckClockDto) {
        try {
            const checkclock = await this.prisma.checkclock.create({ data: dto });
            return {
                statusCode: 201,
                message: "Check Clock created successfully",
                data: checkclock
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getCheckClock(checkclockId: string) {
        const data = await this.prisma.checkclock.findFirst({ where: { id: checkclockId } });
        if (data) {
            return {
                statusCode: 200,
                message: "Check Clock found",
                data: data
            };
        } else {
            return {
                statusCode: 404,
                message: "Check Clock not found"
            };
        }
    }

    async getCheckClocks() {
        return await this.prisma.checkclock.findMany();
    }

    async updateCheckClock(checkclockId: string, dto: editCheckClockDto) {
        try {
            const checkclock = await this.prisma.checkclock.update({ where: { id: checkclockId }, data: dto });
            return {
                statusCode: 200,
                message: "Check Clock updated successfully",
                data: checkclock
            }
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteCheckClock(checkclockId: string) {
        try {
            await this.prisma.checkclock.delete({ where: { id: checkclockId } });
            return {
                statusCode: 200,
                message: "Check Clock deleted successfully"
            };
        } catch (error) {
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
}
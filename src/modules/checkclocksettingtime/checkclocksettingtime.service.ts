import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createCheckClockSettingTimeDto, editCheckClockSettingTimeDto } from "./dto";

@Injectable()
export class CheckClockSettingTimeService {
    constructor(private prisma: PrismaService) {}

    async createCheckClockSettingTime(dto: createCheckClockSettingTimeDto) {
        try {
            const checkclocksettingtime = await this.prisma.checkclocksettingtime.create({ data: dto });
            return {
                statusCode: 201,
                message: "Check Clock Setting Time created successfully",
                data: checkclocksettingtime
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getCheckClockSettingTime(checkclocksettingtimeId: string) {
        const data = await this.prisma.checkclocksettingtime.findFirst({ where: { id: checkclocksettingtimeId } });
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
        return await this.prisma.checkclocksettingtime.findMany();
    }

    async updateCheckClockSettingTime(checkclocksettingtimeId: string, dto: editCheckClockSettingTimeDto) {
        try {
            const checkclocksettingtime = await this.prisma.checkclocksettingtime.update({ where: { id: checkclocksettingtimeId }, data: dto });
            return {
                statusCode: 200,
                message: "Check Clock Setting Time updated successfully",
                data: checkclocksettingtime
            }
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteCheckClockSettingTime(checkclocksettingtimeId: string) {
        try {
            await this.prisma.checkclocksettingtime.delete({ where: { id: checkclocksettingtimeId } });
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
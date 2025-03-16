import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createCheckClockSettingDto, editCheckClockSettingDto } from "./dto";

@Injectable()
export class CheckClockSettingService {
    constructor(private prisma: PrismaService) {}

    async createCheckClockSetting(dto: createCheckClockSettingDto) {
        try {
            const checkclocksetting = await this.prisma.checkclocksetting.create({ data: dto });
            return {
                statusCode: 201,
                message: "Check Clock Setting created successfully",
                data: checkclocksetting
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getCheckClockSetting(checkclocksettingId: string) {
        const data = await this.prisma.checkclocksetting.findFirst({ where: { id: checkclocksettingId } });
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
        return await this.prisma.checkclocksetting.findMany();
    }

    async updateCheckClockSetting(checkclocksettingId: string, dto: editCheckClockSettingDto) {
        try {
            const checkclocksetting = await this.prisma.checkclocksetting.update({ where: { id: checkclocksettingId }, data: dto });
            return {
                statusCode: 200,
                message: "Check Clock Setting updated successfully",
                data: checkclocksetting
            }
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteCheckClockSetting(checkclocksettingId: string) {
        try {
            await this.prisma.checkclocksetting.delete({ where: { id: checkclocksettingId } });
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
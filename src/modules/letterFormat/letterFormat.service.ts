import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLetterFormatDto, EditLetterFormatDto } from "./dto";

@Injectable()
export class LetterFormatService {
    constructor(private prisma: PrismaService) {}

    async createLetterFormat(dto: CreateLetterFormatDto) {
        let data : any = { ...dto}
        try {
            const letterFormat = await this.prisma.letterFormat.create({ data: data });
            return {
                statusCode: 201,
                message: "Letter format created successfully",
                data: letterFormat,
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code || 500, // Default to 500 if error.code is not available
                message: error.message,
            };
        }
    }

    async getLetterFormat(letterFormatId: string) {
        const letterFormat = await this.prisma.letterFormat.findUnique({
            where: { id: letterFormatId },
        });
        if (letterFormat) {
            return {
                statusCode: 200,
                message: "Letter format found",
                data: letterFormat,
            };
        } else {
            return {
                statusCode: 404,
                message: "Letter format not found",
            };
        }
    }

    async getLetterFormats() {
        return await this.prisma.letterFormat.findMany();
    }

    async updateLetterFormat(letterFormatId: string, dto: EditLetterFormatDto) {
        try {
            const letterFormat = await this.prisma.letterFormat.update({
                where: { id: letterFormatId },
                data: dto,
            });
            return {
                statusCode: 200,
                message: "Letter format updated successfully",
                data: letterFormat,
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code || 500, // Default to 500 if error.code is not available
                message: error.message,
            };
        }
    }

    async deleteLetterFormat(letterFormatId: string) {
        try {
            await this.prisma.letterFormat.delete({ where: { id: letterFormatId } });
            return {
                statusCode: 200,
                message: "Letter format deleted successfully",
            };
        } catch (error) {
            return {
                statusCode: error.code || 500, // Default to 500 if error.code is not available
                message: error.message,
            };
        }
    }
}

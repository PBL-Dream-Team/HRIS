import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { createSalaryDto } from "./dto/createsalary.dto";
import { editSalaryDto } from "./dto/editsalary.dto";

@Injectable()
export class SalaryService {
    constructor(private prisma: PrismaService) {}

    async createSalary(dto: createSalaryDto) {
        let data : any = { ...dto };
        try {
            const salary = await this.prisma.salary.create({ data: data });
            return {
                statusCode: 201,
                message: "Salary created successfully",
                data: salary
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getSalary(salaryId: string) {
        const data = await this.prisma.salary.findFirst({ where: { id: salaryId } });
        if (data) {
            return {
                statusCode: 200,
                message: "Salary found",
                data: data
            };
        } else {
            return {
                statusCode: 404,
                message: "Salary not found"
            };
        }
    }

    async getSalarys() {
        return await this.prisma.salary.findMany();
    }

    async updateSalary(salaryId: string, dto: editSalaryDto) {
        let data: any = { ...dto };

        try {
            const salary = await this.prisma.salary.update({ where: { id: salaryId }, data: data });
            return {
                statusCode: 200,
                message: "Salary updated successfully",
                data: salary
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteSalary(salaryId: string) {
        try {
            await this.prisma.salary.delete({ where: { id: salaryId } });
            return {
                statusCode: 200,
                message: "Salary deleted successfully"
            };
        } catch (error) {
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }
}

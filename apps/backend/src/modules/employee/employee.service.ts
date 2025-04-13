import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { createEmployeeDto } from "./dto/createemployee.dto";
import { editEmployeeDto } from "./dto/editemployee.dto";

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) {}

    async createEmployee(dto: createEmployeeDto) {
        try {
            const employee = await this.prisma.employee.create({ data: dto });
            return {
                statusCode: 201,
                message: "Employee created successfully",
                data: employee
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async getEmployee(employeeId: string) {
        const data = await this.prisma.employee.findFirst({ where: { id: employeeId } });
        if (data) {
            return {
                statusCode: 200,
                message: "Employee found",
                data: data
            };
        } else {
            return {
                statusCode: 404,
                message: "Employee not found"
            };
        }
    }

    async getEmployees() {
        return await this.prisma.employee.findMany();
    }

    async updateEmployee(employeeId: string, dto: editEmployeeDto) {
        try {
            const employee = await this.prisma.employee.update({ where: { id: employeeId }, data: dto });
            return {
                statusCode: 200,
                message: "Employee updated successfully",
                data: employee
            };
        } catch (error) {
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }

    async deleteEmployee(employeeId: string) {
        try {
            await this.prisma.employee.delete({ where: { id: employeeId } });
            return {
                statusCode: 200,
                message: "Employee deleted successfully"
            };
        } catch (error) {
            return {
                statusCode: error.code,
                message: error.message
            };
        }
    }
}

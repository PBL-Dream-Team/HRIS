import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createCompanyDto } from './dtos/createCompany.dto';
import { editCompanyDto } from './dtos/editCompany.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async createCompany(dto: createCompanyDto) {
    try {
      const company = await this.prisma.company.create({ data: dto });
      return {
        statusCode: 201,
        message: 'Company created successfully',
        data: company,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getCompany(companyId: string) {
    const data = await this.prisma.company.findFirst({
      where: { id: companyId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Company found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Company not found',
      };
    }
  }

  async getCompanies() {
    return await this.prisma.company.findMany();
  }

  async updateCompany(companyId: string, dto: editCompanyDto) {
    try {
      const company = await this.prisma.company.update({
        where: { id: companyId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'Company updated successfully',
        data: company,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteCompany(companyId: string) {
    try {
      await this.prisma.company.delete({ where: { id: companyId } });
      return {
        statusCode: 200,
        message: 'Company deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async findFilters(filters: Record< string, any>){
    const where: Record<string , any> = {}

    for (const [key,value] of Object.entries(filters)){
      where[key] = { contains: value, mode: 'insensitive'};
    }

    return await this.prisma.company.findMany({where});
  }
}
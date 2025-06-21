import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createLetterTypeDto } from './dtos/createLetterType.dto';
import { editLetterTypeDto } from './dtos/editLetterType.dto';

@Injectable()
export class LetterTypeService {
  constructor(private prisma: PrismaService) {}

  async createLetterType(dto: createLetterTypeDto) {
    try {
      const letterType = await this.prisma.letterType.create({ data: dto });
      return {
        statusCode: 201,
        message: 'LetterType created successfully',
        data: letterType,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getLetterType(letterTypeId: string) {
    const data = await this.prisma.letterType.findFirst({
      where: { id: letterTypeId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'LetterType found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'LetterType not found',
      };
    }
  }

  async getLetterTypes() {
    return await this.prisma.letterType.findMany({
      orderBy:{
        is_deleted: 'desc'
      }
    });
  }

  async updateLetterType(letterTypeId: string, dto: editLetterTypeDto) {
    try {
      const letterType = await this.prisma.letterType.update({
        where: { id: letterTypeId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'LetterType updated successfully',
        data: letterType,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteLetterType(letterTypeId: string) {
    try {
      const lettertype = await this.prisma.letterType.findFirst({
        where: { id: letterTypeId, is_deleted: false },
      });
      if (!lettertype) {
        return {
          statusCode: 404,
          message: 'LetterType not found or already deleted',
        };
      }

      await this.prisma.letterType.update({
        where: { id: letterTypeId },
        data: { is_deleted: true,
          deleted_at: new Date().toISOString()
         },
      });
      return {
        statusCode: 200,
        message: 'LetterType deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async findFilters(filters: Record<string, any>) {
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      where[key] = { equals: value };
    }

    return await this.prisma.letterType.findMany({ where, orderBy: { is_deleted: 'desc' } });
  }
}

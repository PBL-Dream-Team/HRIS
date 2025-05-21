import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createLetterDto } from './dtos/createLetter.dto';
import { editLetterDto } from './dtos/editLetter.dto';

@Injectable()
export class LetterService {
  constructor(private prisma: PrismaService) {}

  async createLetter(dto: createLetterDto) {
    try {
      const letter = await this.prisma.letter.create({ data: dto });
      return {
        statusCode: 201,
        message: 'Letter created successfully',
        data: letter,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getLetter(letterId: string) {
    const data = await this.prisma.letter.findFirst({
      where: { id: letterId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Letter found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Letter not found',
      };
    }
  }

  async getLetters() {
    return await this.prisma.letter.findMany();
  }

  async updateLetter(letterId: string, dto: editLetterDto) {
    try {
      const letter = await this.prisma.letter.update({
        where: { id: letterId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'Letter updated successfully',
        data: letter,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteLetter(letterId: string) {
    try {
      await this.prisma.letter.delete({ where: { id: letterId } });
      return {
        statusCode: 200,
        message: 'Letter deleted successfully',
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

    return await this.prisma.letter.findMany({where});
  }
}
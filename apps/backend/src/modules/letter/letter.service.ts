import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLetterDto } from './dto/createLetter.dto';
import { EditLetterDto } from './dto/editLetter.dto';

@Injectable()
export class LetterService {
  constructor(private prisma: PrismaService) {}

  async createLetter(dto: CreateLetterDto) {
    let data: any = { ...dto };
    try {
      const letter = await this.prisma.letter.create({ data: data });
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
    const letter = await this.prisma.letter.findUnique({
      where: { id: letterId },
    });
    if (letter) {
      return {
        statusCode: 200,
        message: 'Letter found',
        data: letter,
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

  async updateLetter(letterId: string, dto: EditLetterDto) {
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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createLetterDto } from './dtos/createLetter.dto';
import { editLetterDto } from './dtos/editLetter.dto';
import { join } from 'path';
import { createWriteStream, existsSync, unlinkSync } from 'fs';

@Injectable()
export class LetterService {
  constructor(private prisma: PrismaService) {}

  async createLetter(dto: createLetterDto, file?: Express.Multer.File) {
    const data : any = {...dto};

    if(file){
      const filename = `${Date.now()}_${file.originalname}`;
      data.file_dir = filename;
    }
    
    try {
      const letter = await this.prisma.letter.create({ data: data });

      if(file && data.file_dir){
              const writePath = join(process.cwd(),'storage','letter',data.file_dir);
              const writeStream = createWriteStream(writePath);
              writeStream.write(file.buffer);
              writeStream.end();
      }

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

  async updateLetter(letterId: string, dto: editLetterDto, file?: Express.Multer.File) {
    const data : any = {...dto};

    const old = await this.prisma.letter.findFirst({where:{id:letterId}});

    if(file){
      const filename = `${Date.now()}_${file.originalname}`;
      data.file_dir = filename;
    }

    try {
      const letter = await this.prisma.letter.update({
        where: { id: letterId },
        data: dto,
      });

      if(data.file_dir && file){
        const writePath = join(process.cwd(),'storage','letter',data.pict_dir);
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();

        if(old.file_dir){
          const oldPath = join(process.cwd(),'storage','letter',old.file_dir);
          if(existsSync(oldPath)){
            unlinkSync(oldPath);
          }
        }
      }
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
      const letter = await this.prisma.letter.findFirst({ where: { id: letterId}});

      await this.prisma.letter.delete({ where: { id: letterId } });

      if(letter.file_dir){
        const writeStream = join(process.cwd(), 'storage','letter',letter.file_dir);
        if(existsSync(writeStream)){
          unlinkSync(writeStream);
        }
      }

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
      where[key] = { equals: value};
    }

    return await this.prisma.letter.findMany({where});
  }
}
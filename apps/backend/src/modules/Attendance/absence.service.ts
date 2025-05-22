import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAbsenceDto } from './dtos/createAbsence.dto';
import { editAbsenceDto } from './dtos/editAbsence.dto';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AbsenceService {
  constructor(private prisma: PrismaService) {}

  async createAbsence(dto: createAbsenceDto, file?: Express.Multer.File) {
    const data : any = { ...dto};
    
    const filename = `${Date.now()}_${file.originalname}`;
    data.filedir = filename;

    try {
      const absence = await this.prisma.absenceLeave.create({ data: data });

      if(file && data.filedir){
        const writePath = join(process.cwd(),'storage','absence',data.filedir);
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();
      }

      return {
        statusCode: 201,
        message: 'Absence created successfully',
        data: absence,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getAbsence(absenceId: string) {
    const data = await this.prisma.absenceLeave.findFirst({
      where: { id: absenceId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Absence found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Absence not found',
      };
    }
  }

  async getAbsences() {
    return await this.prisma.absenceLeave.findMany();
  }

  async updateAbsence(absenceId: string, dto: editAbsenceDto, file?: Express.Multer.File) {
    const data : any = { ...dto};

    const old = await this.prisma.absenceLeave.findFirst({where:{id:absenceId}});
    
    if(file){
      const filename = `${Date.now()}_${file.originalname}`;
      data.filedir = filename;
    }


    try {
      const absence = await this.prisma.absenceLeave.update({
        where: { id: absenceId },
        data: data,
      });

      if(file && data.filedir){
        const writePath = join(process.cwd(),'storage','absence',data.filedir);
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();
      
        if(old.filedir){
          const oldPath = join(process.cwd(),'storage','absence',old.filedir);
          if(existsSync(oldPath)){
            unlinkSync(oldPath);
          }
        }
      }

      return {
        statusCode: 200,
        message: 'Absence updated successfully',
        data: absence,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteAbsence(absenceId: string) {
    try {
      const data = await this.prisma.absenceLeave.findFirst({where:{id:absenceId}});
  
      await this.prisma.absenceLeave.delete({ where: { id: absenceId } });

      if(data.filedir){
        const oldPath = join(process.cwd(),'storage','absence',data.filedir);
          if(existsSync(oldPath)){
            unlinkSync(oldPath);
          }
      }

      return {
        statusCode: 200,
        message: 'Absence deleted successfully',
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

    return await this.prisma.absenceLeave.findMany({where});
  }
}
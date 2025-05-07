import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAbsenceDto } from './dtos/createAbsence.dto';
import { editAbsenceDto } from './dtos/editAbsence.dto';

@Injectable()
export class AbsenceService {
  constructor(private prisma: PrismaService) {}

  async createAbsence(dto: createAbsenceDto) {
    try {
      const absence = await this.prisma.absenceLeave.create({ data: dto });
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

  async updateAbsence(absenceId: string, dto: editAbsenceDto) {
    try {
      const absence = await this.prisma.absenceLeave.update({
        where: { id: absenceId },
        data: dto,
      });
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
      await this.prisma.absenceLeave.delete({ where: { id: absenceId } });
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
}
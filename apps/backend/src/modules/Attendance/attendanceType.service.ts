import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAttendanceTypeDto } from './dtos/createAttendanceType.dto';
import { editAttendanceTypeDto } from './dtos/editAttendanceType.dto';

@Injectable()
export class AttendanceTypeService {
  constructor(private prisma: PrismaService) {}

  async createAttendanceType(dto: createAttendanceTypeDto) {
    try {
      const attendanceType = await this.prisma.attendanceType.create({
        data: dto,
      });
      return {
        statusCode: 201,
        message: 'AttendanceType created successfully',
        data: attendanceType,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getAttendanceType(attendanceTypeId: string) {
    const data = await this.prisma.attendanceType.findFirst({
      where: { id: attendanceTypeId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'AttendanceType found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'AttendanceType not found',
      };
    }
  }

  async getAttendanceTypes() {
    return await this.prisma.attendanceType.findMany();
  }

  async updateAttendanceType(
    attendanceTypeId: string,
    dto: editAttendanceTypeDto,
  ) {
    try {
      const attendanceType = await this.prisma.attendanceType.update({
        where: { id: attendanceTypeId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'AttendanceType updated successfully',
        data: attendanceType,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteAttendanceType(attendanceTypeId: string) {
    try {
      await this.prisma.attendanceType.delete({
        where: { id: attendanceTypeId },
      });
      return {
        statusCode: 200,
        message: 'AttendanceType deleted successfully',
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

    return await this.prisma.attendanceType.findMany({ where });
  }
}

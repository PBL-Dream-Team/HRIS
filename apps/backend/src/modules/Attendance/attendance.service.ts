import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendance(dto: createAttendanceDto) {
    const AttendanceData : any = dto;
    try {
      const attendance = await this.prisma.attendance.create({ data: AttendanceData });
      return {
        statusCode: 201,
        message: 'Attendance created successfully',
        data: attendance,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getAttendance(attendanceId: string) {
    const data = await this.prisma.attendance.findFirst({
      where: { id: attendanceId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Attendance found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Attendance not found',
      };
    }
  }

  async getAttendances() {
    return await this.prisma.attendance.findMany();
  }

  async updateAttendance(attendanceId: string, dto: editAttendanceDto) {
    const AttendanceData : any = dto;
    try {
      const attendance = await this.prisma.attendance.update({
        where: { id: attendanceId },
        data: AttendanceData,
      });
      return {
        statusCode: 200,
        message: 'Attendance updated successfully',
        data: attendance,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteAttendance(attendanceId: string) {
    try {
      await this.prisma.attendance.delete({ where: { id: attendanceId } });
      return {
        statusCode: 200,
        message: 'Attendance deleted successfully',
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

    return await this.prisma.attendance.findMany({where});
  }
}
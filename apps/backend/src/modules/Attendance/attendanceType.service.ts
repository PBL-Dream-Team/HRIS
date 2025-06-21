import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAttendanceTypeDto } from './dtos/createAttendanceType.dto';
import { editAttendanceTypeDto } from './dtos/editAttendanceType.dto';

@Injectable()
export class AttendanceTypeService {
  constructor(private prisma: PrismaService) {}

  async createAttendanceType(dto: createAttendanceTypeDto) {
    const data : any = {...dto};
    if(dto.workscheme) data.workscheme = dto.workscheme.toUpperCase();
    try {
      const attendanceType = await this.prisma.attendanceType.create({
        data: data,
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
    return await this.prisma.attendanceType.findMany({
      orderBy:{
        is_deleted: 'desc'
      }
    });
  }

  async updateAttendanceType(
    attendanceTypeId: string,
    dto: editAttendanceTypeDto,
  ) {
    const data : any = {...dto};
    if(dto.workscheme) data.workscheme = dto.workscheme.toUpperCase();
    
    try {
      const attendanceType = await this.prisma.attendanceType.update({
        where: { id: attendanceTypeId },
        data: data,
      });
      if(dto.workscheme){
        await this.prisma.employee.updateMany({
          data:{workscheme:dto.workscheme},
          where:{attendance_id:attendanceType.id}
        });
      }
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
      // await this.prisma.employee.updateMany({
      //   data:{
      //     workscheme: null
      //   },
      //   where:{
      //     id: attendanceTypeId
      //   }
      // })
      const attendanceType = await this.prisma.attendanceType.findFirst({
        where: { id: attendanceTypeId, is_deleted: false },
      });

      if (!attendanceType) {
        return {
          statusCode: 404,
          message: 'AttendanceType not found or already deleted',
        };
      }

      const empCount = await this.prisma.employee.findFirst({
        where:{
          attendance_id: attendanceTypeId
        }
      });

      if(empCount){
        return {
          statusCode: 409,
          message:"Attendance type still being used"
        }
      }
      // await this.prisma.attendanceType.delete({
      //   where: { id: attendanceTypeId },
      // });

      await this.prisma.attendanceType.update({
        where: { id: attendanceTypeId },
        data: { is_deleted: true,
          deleted_at: new Date().toISOString(),
         },
      });

      await this.prisma.attendance.updateMany({
        where: { type_id: attendanceTypeId },
        data: { is_deleted: true,
          deleted_at: new Date().toISOString(),
         },
      });

      await this.prisma.employee.updateMany({
        where: { attendance_id: attendanceTypeId },
        data: { attendance_id: null },
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

    return await this.prisma.attendanceType.findMany({ where, orderBy: { is_deleted: 'desc' } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createAttendanceDto } from './dtos/createAttendance.dto';
import { editAttendanceDto } from './dtos/editAttendance.dto';
import { join } from 'path';
import { createWriteStream} from 'fs';

function isTimeAfter(timeA: Date, timeB: Date): boolean {
  const getTimeOnlyMs = (d: Date) =>
    d.getUTCHours() * 3600000 +
    d.getUTCMinutes() * 60000 +
    d.getUTCSeconds() * 1000 +
    d.getUTCMilliseconds();

  return getTimeOnlyMs(timeA) > getTimeOnlyMs(timeB);
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendance(dto: createAttendanceDto, file?: Express.Multer.File) {
    const AttendanceData: any = { ...dto };

    const typ = await this.prisma.attendanceType.findFirst({
      where: { id: AttendanceData.type_id },
    });

    let check_out = new Date(AttendanceData.check_out);
    // Change typ.check_out date to midnight of the next day if hour less than typ.check_in
    if (typ.check_out.getHours() < typ.check_in.getHours()) {
      const checkOutDate = new Date(typ.check_out);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      check_out = checkOutDate;
    }
    if (
      AttendanceData.check_in &&
      isTimeAfter(new Date(AttendanceData.check_in), new Date(check_out))
    ) {
      return {
        statusCode: 400,
        message: 'Check-in time cannot be after check-out time',
      };
    }

    if (AttendanceData.check_in)
      AttendanceData.check_in_status = isTimeAfter(
        new Date(AttendanceData.check_in),
        new Date(typ.check_in),
      )
        ? 'LATE'
        : 'ON_TIME';
    if (AttendanceData.check_out)
      AttendanceData.check_out_status = isTimeAfter(
        new Date(typ.check_out),
        new Date(AttendanceData.check_out),
      )
        ? 'EARLY'
        : 'ON_TIME';

    if (AttendanceData.check_in_status == 'LATE')
      AttendanceData.approval = 'PENDING';
    if (AttendanceData.check_out_status == 'EARLY')
      AttendanceData.approval = 'PENDING';

    if (AttendanceData.check_in_lat > typ.workspace_lat + 100.0)
      AttendanceData.approval = 'PENDING';
    if (AttendanceData.check_in_long > typ.workspace_long + 100.0)
      AttendanceData.approval = 'PENDING';
    if (AttendanceData.check_out_lat > typ.workspace_lat + 100.0)
      AttendanceData.approval = 'PENDING';
    if (AttendanceData.check_out_long > typ.workspace_long + 100.0)
      AttendanceData.approval = 'PENDING';

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      AttendanceData.filedir = filename;
    }

    try {
      const attendance = await this.prisma.attendance.create({
        data: AttendanceData,
      });

      if (file && AttendanceData.filedir) {
        const writePath = join(
          process.cwd(),
          'storage',
          'attendance',
          AttendanceData.filedir,
        );
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();
      }

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
    return await this.prisma.attendance.findMany({
      orderBy:{
        is_deleted: 'desc'
      }
    });
  }

  async updateAttendance(attendanceId: string, dto: editAttendanceDto) {
    const AttendanceData: any = { ...dto };

    const old = await this.prisma.attendance.findFirst({
      where: { id: attendanceId },
    });
    const typ = await this.prisma.attendanceType.findFirst({
      where: { id: old.type_id },
    });

    if (AttendanceData.check_in)
      AttendanceData.check_in_status = isTimeAfter(
        new Date(AttendanceData.check_in),
        new Date(typ.check_in),
      )
        ? 'LATE'
        : 'ON_TIME';
    if (AttendanceData.check_out)
      AttendanceData.check_out_status = isTimeAfter(
        new Date(typ.check_out),
        new Date(AttendanceData.check_out),
      )
        ? 'EARLY'
        : 'ON_TIME';

    if (AttendanceData.check_in_status == 'LATE')
      AttendanceData.approval = 'PENDING';
    if (AttendanceData.check_out_status == 'EARLY')
      AttendanceData.approval = 'PENDING';

    if (
      AttendanceData.check_in_lat > typ.workspace_lat + 100.0 &&
      AttendanceData.check_in_lat
    )
      AttendanceData.approval = 'PENDING';
    if (
      AttendanceData.check_in_long > typ.workspace_long + 100.0 &&
      AttendanceData.check_in_long
    )
      AttendanceData.approval = 'PENDING';
    if (
      AttendanceData.check_out_lat > typ.workspace_lat + 100.0 &&
      AttendanceData.check_out_lat
    )
      AttendanceData.approval = 'PENDING';
    if (
      AttendanceData.check_out_long > typ.workspace_long + 100.0 &&
      AttendanceData.check_out_lat
    )
      AttendanceData.approval = 'PENDING';

    if (
      AttendanceData.check_in_status == 'ON_TIME' &&
      AttendanceData.check_out_status == 'ON_TIME'
    )
      AttendanceData.approval = 'APPROVED';
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
      const data = await this.prisma.attendance.findFirst({
        where: { id: attendanceId },
      });

      if (!data) {
        return {
          statusCode: 404,
          message: 'Attendance not found or already deleted',
        };
      }
      // await this.prisma.attendance.delete({ where: { id: attendanceId } });

      await this.prisma.attendance.update({
        where: { id: attendanceId },
        data: { is_deleted: true,
          deleted_at: new Date().toISOString()
         },
      });
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
  async findFilters(filters: Record<string, any>) {
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      where[key] = { equals: value };
    }

    return await this.prisma.attendance.findMany({ where, orderBy: { is_deleted: 'desc' } });
  }

  async autoCheckout() {
    const workschemes = await this.prisma.attendanceType.findMany();

    const workschemeMap = workschemes.reduce((acc, ws) => {
      acc[ws.id] = ws;
      return acc;
    }, {} as Record<string, typeof workschemes[number]>);
    

    const overdueCheckouts = await this.prisma.attendance.findMany({
      where: {
        check_out: null,
        is_deleted: false,
      }
    });

    for (const attendance of overdueCheckouts) {
      const workscheme = workschemeMap[attendance.type_id];
      if (!workscheme) continue;

      const currentTime = new Date();
      const checkOutTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        workscheme.check_out.getHours(),
        workscheme.check_out.getMinutes(),
        workscheme.check_out.getSeconds(),
      );

      if (currentTime > checkOutTime) {
        await this.prisma.attendance.update({
          where: { id: attendance.id },
          data: {
            check_out: workscheme.check_out,
            check_out_status: 'ON_TIME'
          },
        });
      }
    }

    
  }

  
}

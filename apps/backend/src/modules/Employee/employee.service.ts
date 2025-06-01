import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createEmployeeDto } from './dtos/createEmployee.dto';
import { editEmployeeDto } from './dtos/editEmployee.dto';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { hash, verify } from 'argon2';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(dto: createEmployeeDto, file?: Express.Multer.File) {
    const data: any = { ...dto };

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      data.pict_dir = filename;
    }

    data.password = await hash(dto.password);

    try {
      const employee = await this.prisma.employee.create({ data: data });

      if (file && data.pict_dir) {
        const writePath = join(
          process.cwd(),
          'apps',
          'frontend',
          'public',
          'storage',
          'employee',
          data.pict_dir,
        );
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();
      }
      return {
        statusCode: 201,
        message: 'Employee created successfully',
        data: employee,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getEmployee(employeeId: string) {
    const data = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Employee found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Employee not found',
      };
    }
  }

  async getEmployees() {
    return await this.prisma.employee.findMany();
  }

  async updateEmployee(
    employeeId: string,
    dto: editEmployeeDto,
    file?: Express.Multer.File,
  ) {
    const data: any = { ...dto };

    const user = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      data.pict_dir = filename;
    }

    if (dto.password) {
      const hashed = await hash(dto.password);
      data.password = hashed;
    }

    try {
      const employee = await this.prisma.employee.update({
        where: { id: employeeId },
        data: data,
      });

      if (file && data.pict_dir) {
        const writePath = join(
          process.cwd(),
          'apps',
          'frontend',
          'public',
          'storage',
          'employee',
          data.pict_dir,
        );
        const writeStream = createWriteStream(writePath);
        writeStream.write(file.buffer);
        writeStream.end();

        if (user.pict_dir) {
          const oldPath = join(
            process.cwd(),
            'apps',
            'frontend',
            'public',
            'storage',
            'employee',
            user.pict_dir,
          );
          if (existsSync(oldPath)) {
            unlinkSync(oldPath);
          }
        }
      }

      return {
        statusCode: 200,
        message: 'Employee updated successfully',
        data: employee,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteEmployee(employeeId: string) {
    try {
      const user = await this.prisma.employee.findFirst({
        where: { id: employeeId },
      });

      await this.prisma.employee.delete({ where: { id: employeeId } });

      if (user.pict_dir) {
        // const oldPath = join(process.cwd(), 'storage', 'employee', user.pict_dir);
        const oldPath = join(
          process.cwd(),
          'apps',
          'frontend',
          'public',
          'storage',
          'employee',
          user.pict_dir,
        );
        if (existsSync(oldPath)) {
          unlinkSync(oldPath);
        }
      }

      return {
        statusCode: 200,
        message: 'Employee deleted successfully',
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

    return await this.prisma.employee.findMany({ where });
  }

  async countEmployees(companyId: string): Promise<{ total: number }> {
    const total = await this.prisma.employee.count({
      where: {
        company_id: companyId,
        is_admin: false, // asumsi: admin tidak dihitung
      },
    });
    return { total };
  }

  async getStatusSummary(companyId: string) {
    const employees = await this.prisma.employee.findMany({
      where: {
        company_id: companyId,
        is_admin: false,
      },
    });

    const summary = {
      PERMANENT: 0,
      CONTRACT: 0,
      INTERN: 0,
    };

    for (const emp of employees) {
      summary[emp.contract]++;
    }

    return summary;
  }

  async updatePassword(
    employeeId: string,
    dto: { old_password: string; new_password: string },
  ) {
    const user = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!user) throw new NotFoundException('Employee not found');

    const isPasswordValid = await verify(user.password, dto.old_password);
    if (!isPasswordValid)
      throw new BadRequestException('Incorrect current password');

    const newHashedPassword = await hash(dto.new_password);

    await this.prisma.employee.update({
      where: { id: employeeId },
      data: { password: newHashedPassword },
    });

    return {
      statusCode: 200,
      message: 'Password updated successfully',
    };
  }

  async getStatusCountByCompany(companyId: string) {
    const result = await this.prisma.employee.groupBy({
      by: ['contract'],
      where: { company_id: companyId, is_admin: false },
      _count: { _all: true },
    });

    return result.map((emp) => ({
      name: emp.contract,
      total: emp._count._all,
    }));
  }
}

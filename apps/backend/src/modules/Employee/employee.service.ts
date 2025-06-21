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
import { subMonths, startOfDay, endOfDay, format } from 'date-fns';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validate } from '@nestjs/class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) { }

  async createEmployee(dto: createEmployeeDto, file?: Express.Multer.File) {
    const data: any = { ...dto };

    const company = await this.prisma.company.findFirst({
      where:{
        id:dto.company_id
      }
    });

    const user = await this.prisma.employee.findMany({
      where: {
        OR: [{ email: dto.email.toLowerCase() }, { phone: dto.phone }],
      },
    })
    if (user.length > 0) {
      return {
        statusCode: 422,
        message: 'User with Email or phone already exists',
      };
    }

    const employeeCount = await this.prisma.employee.count({
      where:{
        is_deleted: false,
        company_id: dto.company_id,
      }
    });
    
    const employeeLimit = company.max_employee - employeeCount;

    if(employeeLimit < 1){
      return {
        statusCode: 422,
        message: "Employee limit exceeded"
      }
    }

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      data.pict_dir = filename;
    }
    data.workscheme = dto.workscheme.toUpperCase();
    data.position = data.position ? data.position : "Employee";
    data.password = await hash(dto.password);

    if(dto.attendance_id){
      const attendanceType = await this.prisma.attendanceType.findFirst({
        where:{
          id:dto.attendance_id
        }
      })
      
      data.workscheme = attendanceType.workscheme.toUpperCase();
    }

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
      where: { id: employeeId},
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
    return await this.prisma.employee.findMany({
      orderBy:{
        is_deleted: 'desc'
      }
    });
  }

  async updateEmployee(
    employeeId: string,
    dto: editEmployeeDto,
    file?: Express.Multer.File,
  ) {
    const data: any = { ...dto };
    if(dto.workscheme) data.workscheme = dto.workscheme.toUpperCase();

    const user = await this.prisma.employee.findFirst({
      where: { id: employeeId},
    });

    if(!user) {
      return {
        statusCode: 404,
        message: 'Employee not found',
      };
    }

    if(dto.is_deleted === false){ // Kalau dipecat mau diaktifkan kembali
      data.is_deleted = dto.is_deleted;
      
      const employeeCount = await this.prisma.employee.count({
        where: { company_id: user.company_id , is_deleted: false }
      });

      const company = await this.prisma.company.findFirst({
        where:{
          id:dto.company_id
        }
      });

      const employeeLimit = company.max_employee - employeeCount;
      if(employeeLimit < 1){
        return {
          statusCode: 422,
          message: "Employee limit exceeded"
        }
      }
    }

    if (file) {
      const filename = `${Date.now()}_${file.originalname}`;
      data.pict_dir = filename;
    }

    if (dto.password) {
      const hashed = await hash(dto.password);
      data.password = hashed;
    }

    if(dto.attendance_id){
      const attendanceType = await this.prisma.attendanceType.findFirst({
        where:{
          id:dto.attendance_id
        }
      })
      
      data.workscheme = attendanceType.workscheme.toUpperCase();
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
        where: { id: employeeId, is_deleted: false },
      });

      if (!user) {
        return {
          statusCode: 404,
          message: 'Employee already deleted or not found',
        };
      }

      await this.prisma.employee.update({
        where: { id: employeeId },
        data: { is_deleted: true,
          deleted_at: new Date().toISOString()
         },
      })

      // if (user.pict_dir) {
      //   // const oldPath = join(process.cwd(), 'storage', 'employee', user.pict_dir);
      //   const oldPath = join(
      //     process.cwd(),
      //     'apps',
      //     'frontend',
      //     'public',
      //     'storage',
      //     'employee',
      //     user.pict_dir,
      //   );
      //   if (existsSync(oldPath)) {
      //     unlinkSync(oldPath);
      //   }
      // }

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

    return await this.prisma.employee.findMany({ where, orderBy: { is_deleted: 'desc' } });
  }

  async countEmployees(companyId: string) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const total = await this.prisma.employee.count({
      where: {
        company_id: companyId,
        is_admin: false,
      },
    });

    const newEmployees = await this.prisma.employee.count({
      where: {
        company_id: companyId,
        is_admin: false,
        created_at: {
          gte: subMonths(new Date(), 1),
        },
      },
    });

    const activeEmployees = await this.prisma.attendance.count({
      where: {
        company_id: companyId,
        approval: 'APPROVED',
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
        check_in_status: {
          in: ['ON_TIME', 'LATE'],
        },
        employee: {
          is: {
            company_id: companyId,
            is_admin: false,
          },
        },
      },
    });

    const absentEmployees = await this.prisma.absenceLeave.count({
      where: {
        company_id: companyId,
        status: 'APPROVED',
        type: {
          in: ['SICK', 'PERMIT', 'LEAVE'],
        },
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
        employee: {
          is: {
            company_id: companyId,
            is_admin: false,
          },
        },
      },
    });

    return {
      total,
      newEmployees,
      activeEmployees,
      absentEmployees,
    };
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


  async getAttendanceCountbyCompany(companyId: string) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const today = new Date().toISOString(); // ⬅️ hasil: '2025-06-02'

    const [onTimeCount, lateCount, leaveCount] = await Promise.all([
      this.prisma.attendance.count({
        where: {
          company_id: companyId,
          check_in_status: 'ON_TIME',
          approval: 'APPROVED',
          created_at: { gte: todayStart },
          updated_at: { lte: todayEnd },
          employee: {
            is: {
              company_id: companyId,
              is_admin: false,
            },
          },
        },
      }),

      this.prisma.attendance.count({
        where: {
          company_id: companyId,
          check_in_status: 'LATE',
          approval: 'APPROVED',
          created_at: { gte: todayStart },
          updated_at: { lte: todayEnd },
          employee: {
            is: {
              company_id: companyId,
              is_admin: false,
            },
          },
        },
      }),

      this.prisma.absenceLeave.count({
        where: {
          company_id: companyId,
          status: 'APPROVED',
          type: {
            in: ['SICK', 'PERMIT', 'LEAVE'],
          },
          date: today,
          employee: {
            is: {
              company_id: companyId,
              is_admin: false,
            },
          },
        },
      }),
    ]);

    return {
      onTime: onTimeCount,
      late: lateCount,
      leave: leaveCount,
    };
  }

  async ExportExcel(companyId: string){
    const employees = await this.prisma.employee.findMany({
      where:{company_id:companyId, is_admin:false},
      select:{
        first_name:true,
        last_name:true,
        gender:true,
        email:true,
        // password:true,
        phone:true,
        address: true,
        workscheme:true,
        position:true,
        branch:true,
        contract:true,
        birth_date:true,
        birth_place:true,
        nik:true,
        last_education:true,
        account_bank:true,
        account_number:true,
        account_name:true,
        created_at:true
      }
    });

    if (employees.length === 0) {
      return {
        statusCode: 404,
        message: 'No employee data found to export',
      };
    }

    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return excelBuffer;
  }
  async ImportExcel(companyId: string, file?: Express.Multer.File){
    try{
      const company = await this.prisma.company.findFirst({
        where: {
          id: companyId
        }
      });
      const currentEmployeCount = await this.prisma.employee.count({
        where:{
          company_id: companyId
        }
      });

      const employeeLimit = company.max_employee - currentEmployeCount;

      const existingEmployees = await this.prisma.employee.findMany({
        select: {
          email: true,
          phone: true,
        }})
        ;

      const existingEmails = new Set(
        existingEmployees.map(e => e.email?.toLowerCase())
      );
      const existingPhones = new Set(
        existingEmployees.map(e => e.phone)
      );


      if (!file || !file.buffer) {
        return {
          statusCode: 400,
          error: "No file uploaded or file is invalid",
        };
      }

      const readFile = XLSX.read(file.buffer, {type:'buffer'});
      const sheet = readFile.SheetNames[0];
      const data = readFile.Sheets[sheet];


      const parsedData: Record<string, any>[] = XLSX.utils.sheet_to_json(data);

      if(parsedData.length < 1){
        return {
          statusCode: 422,
          message: "Excel data is empty",
        };
      }

      if (parsedData.length > employeeLimit) {
      return {
        statusCode: 422,
        message: "Excel data exceeds limit",
      };
    }

      const requiredColumns = ['first_name', 'last_name','email','password','phone','workscheme'];

      const rowsWithMissingFields = parsedData
        .map((row, index) => {
          const missingFields = requiredColumns.filter(
            (col) => row[col] === undefined || row[col] === null || row[col] === ''
          );
          return {
            rowIndex: index + 2,
            missingFields,
          };
        })
        .filter(result => result.missingFields.length > 0);
      
      if (rowsWithMissingFields.length > 0) {
        return {
          statusCode: 422,
          error: `Missing required fields: ${rowsWithMissingFields}`,
        };
      }



      let uniqueCheckCount = 0;
      parsedData.map(row=>{
        if(existingEmails.has(row.email?.toLowerCase()) || existingPhones.has(row.phone)){
          uniqueCheckCount++;
        }
      });

      if(uniqueCheckCount != 0){
        return {
          statusCode: 422,
          error: 'A phone or email value is not unique',
        }
      }

      if(!this.ExcelValidation(parsedData)){
        return {
          statusCode: 422,
          error: 'A value is not in the required form',
        }
      }

      const updatedData = await Promise.all(parsedData.map(async row => {
        row.company_id = companyId;
        row.password =  await hash(row.password);
        row.position = row.position ? row.position : 'Employee';
        row.workscheme = row.workscheme?.toUpperCase();
        const typ = await this.prisma.attendanceType.findFirst({
          where:{
            company_id : companyId,
            workscheme : row.workscheme
          },
          orderBy:{
            created_at: 'desc'
          }
        });

        row.attendance_id = typ.id;
        return {
          ...row 
        } as Prisma.EmployeeCreateManyInput;
      }));

      if(updatedData.length > employeeLimit){
        return {
          statusCode: 422,
          error: 'Excel data exceeds limit',
        }
      }

      await this.prisma.employee.createMany({
        data: updatedData,
        skipDuplicates: true
      });

      return {
        statusCode: 201,
        message: "Employee data created"
      }
    } 
    catch(error){
      return{
        statusCode: error?.code || 500,
        message: error?.message || 'Internal Server Error',
      }
    }
  }

  async ExcelValidation(data:any[]){
    for(const row of data.entries()){
      const dto = plainToInstance(createEmployeeDto, row);
      const error = await validate(dto);

      if(error.length > 0){
        return false;
      }
    }
    return true; //Is Safe
  }

}

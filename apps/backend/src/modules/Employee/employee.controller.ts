import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Query, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { createEmployeeDto } from './dtos/createEmployee.dto';
import { editEmployeeDto } from './dtos/editEmployee.dto';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadExtensionInterceptor } from '../../multer/image_upload.interceptor';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { } from 'multer';

@ApiTags("employee")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  @ApiBody({ type: createEmployeeDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
    new UploadExtensionInterceptor(['jpg', 'jpeg', 'png'])
  )
  createEmployee(
    @Body() createEmployeeDto: createEmployeeDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.employeeService.createEmployee(createEmployeeDto, file);
  }

  @Get()
  getEmployees(@Query() query: Record<string, any>) {
    if (Object.keys(query).length > 0) {
      return this.employeeService.findFilters(query);
    }
    return this.employeeService.getEmployees();
  }

  @Get(':id')
  getEmployee(@Param('id') employeeId: string) {
    return this.employeeService.getEmployee(employeeId);
  }

  @Patch(':id')
  @ApiBody({ type: editEmployeeDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
    new UploadExtensionInterceptor(['jpg', 'jpeg', 'png'])
  )
  updateEmployee(
    @Param('id') employeeId: string,
    @Body() updateEmployeeDto: editEmployeeDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.employeeService.updateEmployee(employeeId, updateEmployeeDto, file);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') employeeId: string) {
    return this.employeeService.deleteEmployee(employeeId);
  }

  @Get('count/:companyId')
  async getEmployeeCount(@Param('companyId') companyId: string) {
    return this.employeeService.countEmployees(companyId);
  }

  @Get('status-summary/:companyId')
  async getEmployeeStatusByContract(@Param('companyId') companyId: string) {
    return this.employeeService.getStatusSummary(companyId);
  }


}
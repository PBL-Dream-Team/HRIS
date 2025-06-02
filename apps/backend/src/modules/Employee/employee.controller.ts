import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { createEmployeeDto } from './dtos/createEmployee.dto';
import { editEmployeeDto } from './dtos/editEmployee.dto';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadExtensionInterceptor } from '../../multer/image_upload.interceptor';
import { FileInterceptor} from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { Response } from 'express';
import { join } from 'path';
import {} from 'multer';

@ApiTags('employee')
@UseGuards(JwtGuard)
@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: createEmployeeDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
    new UploadExtensionInterceptor(['jpg', 'jpeg', 'png']),
  )
  createEmployee(
    @Body() createEmployeeDto: createEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
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

  // ✅ SOLUSI 1: Pisahkan menjadi 2 route terpisah
  @Get(':id/avatar')
  async getDefaultAvatar(
    @Param('id') employeeId: string,
    @Res() res: Response,
  ) {
    try {
      // Logic untuk default avatar atau redirect ke filename yang ada
      return res.status(404).json({ message: 'Please specify filename' });
    } catch (error) {
      console.error('Error serving avatar:', error);
      return res.status(500).json({ message: 'Error serving avatar' });
    }
  }

  @Get(':id/avatar/:filename')
  async getAvatar(
    @Param('id') employeeId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      if (!filename || filename === 'undefined' || filename === 'null') {
        return res.status(404).json({ message: 'No filename provided' });
      }

      const filePath = join(process.cwd(), 'storage', 'employee', filename);
      const fs = require('fs');

      console.log('Looking for file at:', filePath); // Debug log

      if (!fs.existsSync(filePath)) {
        console.log('File not found:', filePath); // Debug log
        return res.status(404).json({ message: 'Avatar file not found' });
      }

      return res.sendFile(filePath);
    } catch (error) {
      console.error('Error serving avatar:', error);
      return res.status(500).json({ message: 'Error serving avatar' });
    }
  }

  @Patch(':id')
  @UseGuards(SubscriptionGuard)
  @ApiBody({ type: editEmployeeDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
    new UploadExtensionInterceptor(['jpg', 'jpeg', 'png']),
  )
  updateEmployee(
    @Param('id') employeeId: string,
    @Body() updateEmployeeDto: editEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeeService.updateEmployee(
      employeeId,
      updateEmployeeDto,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(SubscriptionGuard)
  deleteEmployee(@Param('id') employeeId: string) {
    return this.employeeService.deleteEmployee(employeeId);
  }

  @Get('count/:companyId')
  async getEmployeeCount(@Param('companyId') companyId: string) {
    return this.employeeService.countEmployees(companyId);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.employeeService.updatePassword(id, dto);
  }

  @Get('status-count/:companyId')
  async getStatusCount(@Param('companyId') companyId: string) {
    return this.employeeService.getStatusCountByCompany(companyId);
  }
}

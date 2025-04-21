import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { createEmployeeDto } from './dto/createemployee.dto';
import { editEmployeeDto } from './dto/editemployee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  createEmployee(@Body() createEmployeeDto: createEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  getEmployees() {
    return this.employeeService.getEmployees();
  }

  @Get(':id')
  getEmployee(@Param('id') employeeId: string) {
    return this.employeeService.getEmployee(employeeId);
  }

  @Patch(':id')
  updateEmployee(
    @Param('id') employeeId: string,
    @Body() updateEmployeeDto: editEmployeeDto,
  ) {
    return this.employeeService.updateEmployee(employeeId, updateEmployeeDto);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') employeeId: string) {
    return this.employeeService.deleteEmployee(employeeId);
  }
}

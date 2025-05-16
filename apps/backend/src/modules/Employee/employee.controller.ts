import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { createEmployeeDto } from './dtos/createEmployee.dto';
import { editEmployeeDto } from './dtos/editEmployee.dto';
import { JwtGuard, SubscriptionGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("employee")
@UseGuards(JwtGuard, SubscriptionGuard)
@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBody({type:createEmployeeDto})
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
  @ApiBody({type:editEmployeeDto})
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
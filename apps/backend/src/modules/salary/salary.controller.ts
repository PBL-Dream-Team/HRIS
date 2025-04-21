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
import { SalaryService } from './salary.service';
import { createSalaryDto } from './dto/createsalary.dto';
import { editSalaryDto } from './dto/editsalary.dto';

@Controller('salarys')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  createSalary(@Body() createSalaryDto: createSalaryDto) {
    return this.salaryService.createSalary(createSalaryDto);
  }

  @Get()
  getSalarys() {
    return this.salaryService.getSalarys();
  }

  @Get(':id')
  getSalary(@Param('id') salaryId: string) {
    return this.salaryService.getSalary(salaryId);
  }

  @Patch(':id')
  updateSalary(
    @Param('id') salaryId: string,
    @Body() updateSalaryDto: editSalaryDto,
  ) {
    return this.salaryService.updateSalary(salaryId, updateSalaryDto);
  }

  @Delete(':id')
  deleteSalary(@Param('id') salaryId: string) {
    return this.salaryService.deleteSalary(salaryId);
  }
}

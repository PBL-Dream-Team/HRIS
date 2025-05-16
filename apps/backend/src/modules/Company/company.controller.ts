import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createCompanyDto } from './dtos/createCompany.dto';
import { editCompanyDto } from './dtos/editCompany.dto';
import { CompanyService } from './company.service';
import { JwtGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("company")
@UseGuards(JwtGuard)
@Controller('api/company')
export class CompanyController {
  constructor(private readonly CompanyService: CompanyService) {}

  @Post()
  @ApiBody({type:createCompanyDto})
  createCompany(@Body() createCompanyDto: createCompanyDto) {
    return this.CompanyService.createCompany(createCompanyDto);
  }

  @Get()
  getCompanys() {
    return this.CompanyService.getCompanys();
  }

  @Get(':id')
  getCompany(@Param('id') companyId: string) {
    return this.CompanyService.getCompany(companyId);
  }

  @Patch(':id')
  @ApiBody({type:editCompanyDto})
  updateCompany(
    @Param('id') companyId: string,
    @Body() updateCompanyDto: editCompanyDto,
  ) {
    return this.CompanyService.updateCompany(companyId, updateCompanyDto);
  }

  @Delete(':id')
  deleteCompany(@Param('id') companyId: string) {
    return this.CompanyService.deleteCompany(companyId);
  }
}
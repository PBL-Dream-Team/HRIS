import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SubsService } from './subs.service';
import { createSubsDto, editSubsDto } from './dto';

@Controller('subscriptions')
export class SubsController {
  constructor(private subsService: SubsService) {}

  @Post()
  createSubs(@Body() dto: createSubsDto) {
    return this.subsService.createSubs(dto);
  }

  @Get(':id')
  getSub(@Param('id') subsId: string) {
    return this.subsService.getSub(subsId);
  }
  @Get()
  getSubs() {
    return this.subsService.getSubs();
  }
  @Patch(':id')
  editSubs(@Param('id') subsId: string, @Body() dto: editSubsDto) {
    return this.subsService.updateSubs(subsId, dto);
  }
  @Delete(':id')
  deleteSubs(@Param('id') subsId: string) {
    return this.subsService.deleteSubs(subsId);
  }
}

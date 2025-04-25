import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { createWorkspaceDto, editWorkspaceDto } from './dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private WorkspaceService: WorkspaceService) {}

  @Post()
  createWorkspace(@Body() dto: createWorkspaceDto) {
    return this.WorkspaceService.createWorkspace(dto);
  }

  @Get(':id')
  getWorkspace(@Param('id') WorkspaceId: string) {
    return this.WorkspaceService.getWorkspace(WorkspaceId);
  }
  @Get()
  getWorkspaces() {
    return this.WorkspaceService.getWorkspaces();
  }
  @Patch(':id')
  editWorkspace(
    @Param('id') WorkspaceId: string,
    @Body() dto: editWorkspaceDto,
  ) {
    return this.WorkspaceService.updateWorkspace(WorkspaceId, dto);
  }
  @Delete(':id')
  deleteWorkspace(@Param('id') WorkspaceId: string) {
    return this.WorkspaceService.deleteWorkspace(WorkspaceId);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createWorkspaceDto, editWorkspaceDto } from './dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(dto: createWorkspaceDto) {
    let data: any = { ...dto };

    try {
      const workspace = await this.prisma.workspace.create({ data: data });

      return {
        statusCode: 201,
        message: 'Data created successfully',
        data: workspace,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async getWorkspace(workspaceId: string) {
    const data = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
      },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Data found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Data not found',
      };
    }
  }
  async getWorkspaces() {
    return await this.prisma.workspace.findMany();
  }
  async updateWorkspace(workspaceId: string, dto: editWorkspaceDto) {
    let data: any = { ...dto };

    try {
      const workspace = await this.prisma.workspace.update({
        where: { id: workspaceId },
        data: data,
      });

      return {
        statusCode: 200,
        message: 'Data updated successfully',
        data: workspace,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async deleteWorkspace(workspaceId: string) {
    try {
      await this.prisma.workspace.delete({ where: { id: workspaceId } });

      return {
        statusCode: 200,
        message: 'Data deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
}

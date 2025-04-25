import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createSubsDto, editSubsDto } from './dto';

@Injectable()
export class SubsService {
  constructor(private prisma: PrismaService) {}

  async createSubs(dto: createSubsDto) {
    let data: any = { ...dto };
    try {
      const subs = await this.prisma.subscription.create({ data: data });

      return {
        statusCode: 201,
        message: 'Data created successfully',
        data: subs,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async getSub(subsId: string) {
    const data = await this.prisma.subscription.findFirst({
      where: {
        id: subsId,
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
  async getSubs() {
    return await this.prisma.subscription.findMany();
  }
  async updateSubs(subsId: string, dto: editSubsDto) {
    let data: any = { ...dto };

    try {
      const subs = await this.prisma.subscription.update({
        where: { id: subsId },
        data: data,
      });

      return {
        statusCode: 200,
        message: 'Data updated successfully',
        data: subs,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async deleteSubs(subsId: string) {
    try {
      await this.prisma.subscription.delete({ where: { id: subsId } });

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

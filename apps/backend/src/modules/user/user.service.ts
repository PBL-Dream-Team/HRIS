import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createUserDto, editUserDto } from './dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: createUserDto) {
    const hashed = await hash(dto.password);
    let data: any = { ...dto };

    data.password = hashed;

    try {
      const user = await this.prisma.user.create({ data: data });

      return {
        statusCode: 201,
        message: 'Data created successfully',
        data: user,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async getUser(userId: string) {
    const data = await this.prisma.user.findFirst({
      where: {
        id: userId,
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
  async getUsers() {
    return await this.prisma.user.findMany();
  }
  async updateUser(userId: string, dto: editUserDto) {
    let data: any = { ...dto };

    if (dto.password) {
      data.password = await hash(dto.password);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: data,
      });

      return {
        statusCode: 200,
        message: 'Data updated successfully',
        data: user,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async deleteUser(userId: string) {
    try {
      await this.prisma.user.delete({ where: { id: userId } });

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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createTransactionDto } from './dtos/createTransaction.dto';
import { editTransactionDto } from './dtos/editTransaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(dto: createTransactionDto) {
    const data: any = { ...dto };

    try {
      const transaction = await this.prisma.transaction.create({ data: data });
      return {
        statusCode: 201,
        message: 'Transaction created successfully',
        data: transaction,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getTransaction(transactionId: string) {
    const data = await this.prisma.transaction.findFirst({
      where: { id: transactionId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Transaction found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Transaction not found',
      };
    }
  }

  async getTransactions() {
    return await this.prisma.transaction.findMany();
  }

  async updateTransaction(transactionId: string, dto: editTransactionDto) {
    try {
      const transaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'Transaction updated successfully',
        data: transaction,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteTransaction(transactionId: string) {
    try {
      await this.prisma.transaction.delete({ where: { id: transactionId } });
      return {
        statusCode: 200,
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async findFilters(filters: Record<string, any>) {
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      where[key] = { equals: value };
    }

    return await this.prisma.transaction.findMany({ where });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaymentDto } from './dto/createpayment.dto';
import { updatePaymentDto } from './dto/updatepayment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: createPaymentDto) {
    try {
      const payment = await this.prisma.payment.create({ data: dto });
      return {
        statusCode: 201,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getPayment(paymentId: string) {
    const data = await this.prisma.payment.findFirst({
      where: { id: paymentId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Payment found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Payment not found',
      };
    }
  }

  async getPayments() {
    return await this.prisma.payment.findMany();
  }

  async updatePayment(paymentId: string, dto: updatePaymentDto) {
    try {
      const payment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'Payment updated successfully',
        data: payment,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deletePayment(paymentId: string) {
    try {
      await this.prisma.payment.delete({ where: { id: paymentId } });
      return {
        statusCode: 200,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
}

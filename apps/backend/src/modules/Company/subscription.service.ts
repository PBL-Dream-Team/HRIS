import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createSubscriptionDto } from './dtos/createSubscription.dto';
import { editSubscriptionDto } from './dtos/editSubscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(dto: createSubscriptionDto) {
    try {
      const subscription = await this.prisma.subscription.create({ data: dto });
      return {
        statusCode: 201,
        message: 'Subscription created successfully',
        data: subscription,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async getSubscription(subscriptionId: string) {
    const data = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId },
    });
    if (data) {
      return {
        statusCode: 200,
        message: 'Subscription found',
        data: data,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Subscription not found',
      };
    }
  }

  async getSubscriptions() {
    return await this.prisma.subscription.findMany();
  }

  async updateSubscription(subscriptionId: string, dto: editSubscriptionDto) {
    try {
      const subscription = await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: dto,
      });
      return {
        statusCode: 200,
        message: 'Subscription updated successfully',
        data: subscription,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async deleteSubscription(subscriptionId: string) {
    try {
      await this.prisma.subscription.delete({ where: { id: subscriptionId } });
      return {
        statusCode: 200,
        message: 'Subscription deleted successfully',
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

    return await this.prisma.subscription.findMany({ where });
  }
}

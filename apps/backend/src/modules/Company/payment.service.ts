import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  async tripayCallbackHandler(req: any) {
    try {
      if (req) {
        const transactionData = {
          paymentMethod: req.payment_method,
          paidAt: new Date(parseInt(req.paid_at, 10) * 1000).toISOString(),
        };

        const transac = await this.prisma.transaction.findFirst({
          where: { merchantRef: req.merchant_ref },
        });
        const subs = await this.prisma.subscription.findFirst({
          where: { id: transac.subscription_id },
        });
        const company = await this.prisma.company.findFirst({
          where: { id: transac.company_id },
        });

        await this.prisma.transaction.update({
          data: {
            ...transactionData,
            status: 'PAID',
          },
          where: {
            id: transac.id,
          },
        });

        const newStart = new Date(transactionData.paidAt);
        const newEnd = new Date(newStart);
        newEnd.setDate(newStart.getDate() + subs.day_length);
        const new_emp = subs.max_employee
          ? subs.max_employee
          : transac.total /
            Math.round(
              (subs.price_per_employee * (100.0 + transac.taxRate.toNumber())) /
                100,
            );

        await this.prisma.company.update({
          data: {
            subs_date_start: newStart.toISOString(),
            subs_date_end: newEnd.toISOString(),
            max_employee: new_emp,
          },
          where: {
            id: company.id,
          },
        });

        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

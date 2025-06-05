import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';


@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  async createTransaction(data: any) {
    const {
      subscription_id,
      title,
      price,
      employeeCount,
      type,
      method,
      amount,
      merchant_ref,
      expired,
    } = data;

    const apiKey = process.env.TRIPAY_API_KEY;
    const privateKey = process.env.TRIPAY_PRIVATE_KEY;
    const merchantCode = process.env.TRIPAY_MERCHANT_CODE;

    const signature = crypto
      .createHmac('sha256', privateKey)
      .update(merchantCode + merchant_ref + amount)
      .digest('hex');

    //Using @GetUser on controller somehow make every transaction using the same name
    const transaction = await this.prisma.transaction.findFirst({where:{
      merchantRef: merchant_ref
    }});
    const company = await this.prisma.company.findFirst({where:{
      id: transaction.company_id
    }});
    const customer = await this.prisma.employee.findFirst({where:{
      AND: [{ company_id: company.id }, { is_admin: true }],
    }});

    const payload = {
      method: method,
      merchant_ref: merchant_ref,
      amount : amount,
      customer_name: `${customer.first_name} ${customer.last_name}`, // ← bisa ambil dari DB user
      customer_email: customer.email,
      customer_phone: customer.phone,
      order_items: [
        {
          sku: subscription_id,
          name: title,
          price: price,
          quantity: type === 'payg' ? employeeCount : 1,
        },
      ],
      expired_time: expired,
      signature: signature,
      return_url: process.env.RETURN_URL,
    };

    const res = await axios.post(
      'https://tripay.co.id/api/transaction/create',
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        validateStatus: () => true, // bypass status check
      },
    );

    await this.prisma.transaction.update({
      where:{merchantRef:merchant_ref},
      data:{
        tripayRef:res.data.reference
      }
    });

    return res.data;
  }
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
            // Math.round(
            //   (subs.price_per_employee * (100.0 + transac.taxRate.toNumber())) /
            //     100,
            // )
            subs.price_per_employee
            ;

        await this.prisma.company.update({
          data: {
            subscription_id: subs.id,
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

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class TripayService {
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

    const payload = {
      method,
      merchant_ref,
      amount,
      customer_name: 'Customer Name', // ← bisa ambil dari DB user
      customer_email: 'email@example.com',
      customer_phone: '08123456789',
      order_items: [
        {
          sku: subscription_id,
          name: title,
          price: price,
          quantity: type === 'payg' ? employeeCount : 1,
        },
      ],
      expired_time: expired,
      signature,
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

    return res.data;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TripayTransactionDto } from './dtos/tripay.dto';
import { GetUser } from '../Auth/decorator';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly PaymentService: PaymentService) {}

  
  @Post('/init')
  async create(@Body() dto: TripayTransactionDto, @GetUser('sub') id:string) {
    const result = await this.PaymentService.createTransaction(dto, id);

    if (result.success) {
      return {
        success: true,
        checkout_url: result.data.checkout_url,
      };
    } else {
      return {
        success: false,
        message: result.message,
        details: result,
      };
    }
  }

  @Post('/callback')
  gatewayCallback(@Body() req: any) {
    return this.PaymentService.tripayCallbackHandler(req);
  }
}

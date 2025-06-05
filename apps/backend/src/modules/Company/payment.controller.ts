import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TripayTransactionDto } from './dtos/tripay.dto';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly PaymentService: PaymentService) {}

  @UseGuards(JwtGuard)
  @Post('/init')
  async create(@Body() dto: TripayTransactionDto) {
    const result = await this.PaymentService.createTransaction(dto);

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

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TripayTransactionDto } from './dtos/tripay.dto';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
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

  @Get('/detail/:id')
  getPaymentDetail(@Param('id') ref: string) {
      return this.PaymentService.getPaymentDetail(ref);
  }

  @Get('/check-status/:id')
  getPaymentStatus(@Param('id') ref: string) {
      return this.PaymentService.getPaymentStatus(ref);
  }

  @Post('/callback')
  gatewayCallback(@Body() req: any) {
    return this.PaymentService.tripayCallbackHandler(req);
  }
}

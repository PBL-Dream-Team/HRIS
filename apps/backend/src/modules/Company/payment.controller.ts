import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TripayTransactionDto } from './dtos/tripay.dto';
import { GetUser } from '../Auth/decorator';
import { JwtGuard } from '../Auth/guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({
    summary:"Get payment detail using merchantRef"
  })
  getPaymentDetail(@Param('id') ref: string) { // Remember to pass tripayRef
      return this.PaymentService.getPaymentDetail(ref);
  }

  @Get('/check-status/:id')
   @ApiOperation({
    summary:"Get payment status using merchantRef"
  })
  getPaymentStatus(@Param('id') ref: string) { // Remember to pass tripayRef
      return this.PaymentService.getPaymentStatus(ref);
  }

  @Post('/callback')
  gatewayCallback(@Body() req: any) {
    return this.PaymentService.tripayCallbackHandler(req);
  }
}

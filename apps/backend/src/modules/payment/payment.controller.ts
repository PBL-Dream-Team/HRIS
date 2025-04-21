import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { createPaymentDto } from './dto/createpayment.dto';
import { updatePaymentDto } from './dto/updatepayment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() createPaymentDto: createPaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  getPayments() {
    return this.paymentService.getPayments();
  }

  @Get(':id')
  getPayment(@Param('id') paymentId: string) {
    return this.paymentService.getPayment(paymentId);
  }

  @Patch(':id')
  updatePayment(
    @Param('id') paymentId: string,
    @Body() updatePaymentDto: updatePaymentDto,
  ) {
    return this.paymentService.updatePayment(paymentId, updatePaymentDto);
  }

  @Delete(':id')
  deletePayment(@Param('id') paymentId: string) {
    return this.paymentService.deletePayment(paymentId);
  }
}

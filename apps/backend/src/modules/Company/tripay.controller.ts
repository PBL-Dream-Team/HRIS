import { Body, Controller, Post } from '@nestjs/common';
import { TripayTransactionDto } from './dtos/tripay.dto';
import { TripayService } from './tripay.service';

@Controller('api/tripay-transaction')
export class TripayController {
  constructor(private readonly tripayService: TripayService) {}

  @Post()
  async create(@Body() dto: TripayTransactionDto) {
    const result = await this.tripayService.createTransaction(dto);

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
}

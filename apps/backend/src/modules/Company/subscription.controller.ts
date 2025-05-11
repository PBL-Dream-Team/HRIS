import {Controller,Get,Post,Body,Param,Delete,Patch, UseGuards,} from '@nestjs/common';
import { createSubscriptionDto } from './dtos/createSubscription.dto';
import { editSubscriptionDto } from './dtos/editSubscription.dto';
import { SubscriptionService } from './subscription.service';
import { JwtGuard } from '../Auth/guard';

@UseGuards(JwtGuard)
@Controller('api/subscription')
export class SubscriptionController {
  constructor(private readonly SubscriptionService: SubscriptionService) {}

  @Post()
  createSubscription(@Body() createSubscriptionDto: createSubscriptionDto) {
    return this.SubscriptionService.createSubscription(createSubscriptionDto);
  }

  @Get()
  getSubscriptions() {
    return this.SubscriptionService.getSubscriptions();
  }

  @Get(':id')
  getSubscription(@Param('id') subscriptionId: string) {
    return this.SubscriptionService.getSubscription(subscriptionId);
  }

  @Patch(':id')
  updateSubscription(
    @Param('id') subscriptionId: string,
    @Body() updateSubscriptionDto: editSubscriptionDto,
  ) {
    return this.SubscriptionService.updateSubscription(subscriptionId, updateSubscriptionDto);
  }

  @Delete(':id')
  deleteSubscription(@Param('id') subscriptionId: string) {
    return this.SubscriptionService.deleteSubscription(subscriptionId);
  }
}
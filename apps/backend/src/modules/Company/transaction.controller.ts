import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { createTransactionDto } from './dtos/createTransaction.dto';
import { editTransactionDto } from './dtos/editTransaction.dto';
import { TransactionService } from './transaction.service';
import { JwtGuard } from '../Auth/guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('transaction')
@UseGuards(JwtGuard)
@Controller('api/transaction')
export class TransactionController {
  constructor(private readonly TransactionService: TransactionService) {}

  @Post()
  @ApiBody({ type: createTransactionDto })
  createTransaction(@Body() createTransactionDto: createTransactionDto) {
    return this.TransactionService.createTransaction(createTransactionDto);
  }

  @Get()
  getTransactions(@Query() query: Record<string, any>) {
    if (Object.keys(query).length > 0) {
      return this.TransactionService.findFilters(query);
    }
    return this.TransactionService.getTransactions();
  }

  @Get(':id')
  getTransaction(@Param('id') transactionId: string) {
    return this.TransactionService.getTransaction(transactionId);
  }

  @Patch(':id')
  @ApiBody({ type: editTransactionDto })
  updateTransaction(
    @Param('id') transactionId: string,
    @Body() updateTransactionDto: editTransactionDto,
  ) {
    return this.TransactionService.updateTransaction(
      transactionId,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  deleteTransaction(@Param('id') transactionId: string) {
    return this.TransactionService.deleteTransaction(transactionId);
  }
}

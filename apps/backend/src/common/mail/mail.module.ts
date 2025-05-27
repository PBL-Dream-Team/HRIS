import { Module } from '@nestjs/common';
import { CustomMailService } from './mail.service';

@Module({
  providers: [CustomMailService],
  exports: [CustomMailService],
})
export class CommonModule {}
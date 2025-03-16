import { Module } from '@nestjs/common';
import { LetterFormatService } from './letterFormat.service';
import { LetterFormatController } from './letterFormat.controller';

@Module({
  controllers: [LetterFormatController],
  providers: [LetterFormatService],
})
export class LetterFormatModule {}
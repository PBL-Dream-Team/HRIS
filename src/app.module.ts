import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LetterModule } from './modules/letter/letter.module';
import { LetterFormatModule } from './modules/letterFormat/letterFormat.module';

@Module({
  imports: [UserModule, LetterModule, LetterFormatModule],
})
export class AppModule {}

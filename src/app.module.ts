import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LetterModule } from './modules/letter/letter.module';

@Module({
  imports: [UserModule, LetterModule],
})
export class AppModule {}

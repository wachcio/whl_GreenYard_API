import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => MailModule)],
  controllers: [UserController],
  providers: [MailModule, UserService],
  exports: [UserService],
})
export class UserModule {}

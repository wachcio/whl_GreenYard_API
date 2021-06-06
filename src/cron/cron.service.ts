import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from 'src/user/user.entity';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async clearExpiredPasswordToken() {
    const user = await User.find();

    user.map(async (v) => {
      if (
        v.resetPasswordExpirationDate < new Date() &&
        v.resetPasswordExpirationDate != null
      ) {
        v.resetPasswordToken = null;
        v.resetPasswordExpirationDate = null;
        await User.update(v.id, v);
      }
    });
  }
}

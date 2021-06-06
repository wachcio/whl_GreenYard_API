import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Main() {
    return `Mushrooms Atlas API written on NestJS`;
  }
}

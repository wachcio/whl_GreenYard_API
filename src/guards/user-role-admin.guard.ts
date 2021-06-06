import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRoleEnum } from 'src/user/dto/register.dto';

@Injectable()
export class UserRoleAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.user.role === userRoleEnum.admin;
  }
}

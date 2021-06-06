import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserResponse } from '../interfaces/user';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { UserRoleAdminGuard } from 'src/guards/user-role-admin.guard';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Put('/changepassword')
  // @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  @UseGuards(AuthGuard('jwt'))
  changePasswordUser(@Body() pwd, @UserObj() user: User) {
    return this.userService.changePassword(user, pwd);
  }

  @Get('/')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('/register')
  // @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  register(@Body() newUser: RegisterDto): Promise<RegisterUserResponse> {
    return this.userService.register(newUser);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  getOneUser(@Param('id') id: string): Promise<User> {
    return this.userService.getOneUser(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  updateUser(
    @Param('id') id: string,
    @Body() updateUser: RegisterDto,
  ): Promise<UpdateResult> {
    return this.userService.updateUser(id, updateUser);
  }

  @Get('/resetPassword/:token')
  resetPasswordToken(@Param('token') token: string): Promise<any> {
    return this.userService.resetPasswordToken(token);
  }

  @Post('/resetPassword')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<any> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}

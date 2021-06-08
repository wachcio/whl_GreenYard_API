import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { UserRoleModeratorsGuard } from '../guards/user-role-moderators.guard';
import { WorkingHoursService } from './working-hours.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from 'src/user/user.entity';

@Controller('working-hours')
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createWorkingHourDto: CreateWorkingHourDto,
    @UserObj() user: User,
  ) {
    return this.workingHoursService.create(createWorkingHourDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@UserObj() user: User) {
    return this.workingHoursService.findAll(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @UserObj() user: User) {
    return this.workingHoursService.findOne(id, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateWorkingHourDto: UpdateWorkingHourDto,
  ) {
    return this.workingHoursService.update(+id, updateWorkingHourDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @UserObj() user: User) {
    return this.workingHoursService.remove(id, user);
  }
}

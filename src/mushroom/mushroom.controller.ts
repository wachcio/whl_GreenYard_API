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
import { UserObj } from 'src/decorators/user-obj.decorator';
import { UserRoleAdminGuard } from 'src/guards/user-role-admin.guard';
import { UserRoleModeratorsGuard } from 'src/guards/user-role-moderators.guard';
import { User } from 'src/user/user.entity';
import { UpdateResult } from 'typeorm';
import { MushroomDto } from './dto/mushroom.dto';
import { MushroomItem } from './mushroom-item.entity';
import { MushroomService } from './mushroom.service';

@Controller('mushroom')
export class MushroomController {
  constructor(
    @Inject(MushroomService) private mushroomService: MushroomService,
  ) {}
  @Get('/')
  getAllMushrooms(): Promise<MushroomItem[]> {
    return this.mushroomService.getAllMushrooms();
  }

  @Get('/shortdata')
  getShortDataAllMushrooms(): Promise<MushroomItem[]> {
    return this.mushroomService.getShortDataAllMushrooms();
  }

  @Get('/:searchText')
  findMushrooms(
    @Param('searchText') searchText: string,
  ): Promise<MushroomItem[]> {
    return this.mushroomService.findMushrooms(searchText);
  }
  @Get('/slug/:slug')
  findSlugMushroom(@Param('slug') slug: string): Promise<MushroomItem> {
    return this.mushroomService.findSlugMushroom(slug);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'), UserRoleModeratorsGuard)
  createMushroom(@Body() newMushroom: MushroomDto) {
    return this.mushroomService.createMushroom(newMushroom);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  @HttpCode(204)
  deleteMushroom(@Param('id') id: string) {
    return this.mushroomService.deleteMushroom(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), UserRoleModeratorsGuard)
  update(
    @Param('id') id: string,
    @Body() updateMushroom: MushroomDto,
  ): Promise<UpdateResult> {
    return this.mushroomService.updateMushroom(id, updateMushroom);
  }
}

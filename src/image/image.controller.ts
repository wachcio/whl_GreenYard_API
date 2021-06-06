import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from '../utils/storage';
import { MulterDiskUploadedFiles } from '../interceptors/files';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleAdminGuard } from 'src/guards/user-role-admin.guard';
import { UserRoleModeratorsGuard } from 'src/guards/user-role-moderators.guard';
import { mushroomImagePath } from 'src/utils/imagePath';
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/count/:id')
  async getImagesCount(@Param('id') id: string, @Res() res: any): Promise<any> {
    return this.imageService.getImagesCount(id, res);
  }

  @Get('/:mushroomId/:imageNumber')
  async getImage(
    @Param('mushroomId') mushroomId: string,
    @Param('imageNumber') imageNumber: number,
    @Res() res: any,
  ): Promise<any> {
    return this.imageService.getImage(mushroomId, imageNumber - 1, res);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'), UserRoleModeratorsGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'photo',
          maxCount: 1,
        },
      ],
      { storage: multerStorage(mushroomImagePath) },
    ),
  )
  create(
    @Body() ImageDto: ImageDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ) {
    return this.imageService.create(ImageDto, files);
  }

  @Get('/mushroom')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  findAll() {
    return this.imageService.findAll();
  }

  @Get('/mushroom/:mushroomId')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  findOne(@Param('mushroomId') mushroomId: string) {
    return this.imageService.findOne(mushroomId);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateImage: Image) {
  //   return this.imageService.update(+id, updateImage);
  // }

  @Delete('/:mushroomId/:imageNumber')
  @UseGuards(AuthGuard('jwt'), UserRoleAdminGuard)
  remove(
    @Param('mushroomId') mushroomId: string,
    @Param('imageNumber') imageNumber: number,
  ) {
    return this.imageService.remove(mushroomId, imageNumber);
  }
}

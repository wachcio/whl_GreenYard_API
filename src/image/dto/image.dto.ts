import { IsMimeType, IsUUID } from 'class-validator';

export class ImageDto {
  @IsMimeType()
  imageName: string;

  @IsUUID()
  mushroomId: string;
}

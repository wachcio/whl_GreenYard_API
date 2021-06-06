import { IsString, MaxLength, MinLength } from 'class-validator';
import { messageMax, messageMin } from '../../utils/validation-message';

export class AuthLoginDto {
  @IsString()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  username: string;

  @IsString()
  @MinLength(8, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  pwd: string;
}

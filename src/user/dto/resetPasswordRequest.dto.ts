import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { messageMax, messageMin } from '../../utils/validation-message';

export class ResetPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  username: string;
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: `email is not valid`,
    },
  )
  @MinLength(6, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  email: string;
}

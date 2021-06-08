import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { messageMax, messageMin } from '../../utils/validation-message';

export enum userRoleEnum {
  'user' = 'user',
  // 'moderator' = 'moderator',
  'admin' = 'admin',
}
function convertUserRoleEnumToString() {
  let result = '';

  Object.keys(userRoleEnum).filter((key) => (result += key + ', '));
  result = result.slice(0, -2);
  return result;
}

export class RegisterDto {
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
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, {
  //   message:
  //     'A password at least contains one numeric digit, one supercase char and one lowercase char',
  // })
  pwd: string;
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(userRoleEnum, {
    message: `role must be a valid enum value (${convertUserRoleEnumToString()})`,
  })
  role: userRoleEnum;
}

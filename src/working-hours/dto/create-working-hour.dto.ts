import {
  IsISO8601,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { messageMax, messageMin } from '../../utils/validation-message';
export class CreateWorkingHourDto {
  @IsNotEmpty()
  @IsISO8601()
  date: Date;
  @IsNotEmpty()
  @IsMilitaryTime()
  startTimeOfWork: Date;
  @IsNotEmpty()
  @IsMilitaryTime()
  endTimeOfWork: Date;

  @IsString()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  workDescription: string;
}

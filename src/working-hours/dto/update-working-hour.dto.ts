import { PartialType } from '@nestjs/swagger';
import { CreateWorkingHourDto } from './create-working-hour.dto';
import { RegisterUserResponse } from '../../interfaces/user';

export class UpdateWorkingHourDto extends PartialType(CreateWorkingHourDto) {
  owner: RegisterUserResponse;
  dateOfWork: Date;
  startTimeOfWork: Date;
  endTimeOfWork: Date;
  workDescription: string;
  createAt: Date;
  updateAt: Date;
}

import { RegisterUserResponse } from './user';

export interface WorkingHoursResponse {
  owner: RegisterUserResponse;
  dateOfWork: Date | string;
  startTimeOfWork: Date | string;
  endTimeOfWork: Date | string;
  workDescription: string;
  createAt: Date;
  updateAt: Date;
}

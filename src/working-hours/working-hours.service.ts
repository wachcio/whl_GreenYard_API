import { Injectable } from '@nestjs/common';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';

@Injectable()
export class WorkingHoursService {
  create(createWorkingHourDto: CreateWorkingHourDto) {
    return 'This action adds a new workingHour';
  }

  findAll() {
    return `This action returns all workingHours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingHour`;
  }

  update(id: number, updateWorkingHourDto: UpdateWorkingHourDto) {
    return `This action updates a #${id} workingHour`;
  }

  remove(id: number) {
    return `This action removes a #${id} workingHour`;
  }
}

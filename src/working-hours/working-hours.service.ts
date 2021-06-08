import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { WorkingHour } from './entities/working-hour.entity';

@Injectable()
export class WorkingHoursService {
  async create(createWorkingHourDto: CreateWorkingHourDto, user: User) {
    const wHours = new WorkingHour();
    try {
      wHours.owner = user;
      wHours.date = createWorkingHourDto.date;
      wHours.startTimeOfWork = createWorkingHourDto.startTimeOfWork;
      wHours.endTimeOfWork = createWorkingHourDto.endTimeOfWork;
      wHours.workDescription = createWorkingHourDto.workDescription;
      await wHours.save();

      return wHours;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `Working hours on '${wHours.date}' is already exist.`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return err;
      }
    }

    return 'This action adds a new workingHour';
  }

  async findAll() {
    return `This action returns all workingHours.`;
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

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WorkingHoursResponse } from 'src/interfaces/hourse';
import { User } from 'src/user/user.entity';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { WorkingHour } from './entities/working-hour.entity';

@Injectable()
export class WorkingHoursService {
  filter(user: User) {
    const { username, email, role } = user;
    return { username, email, role };
  }

  async create(
    createWorkingHourDto: CreateWorkingHourDto,
    user: User,
  ): Promise<WorkingHoursResponse> {
    const wHours = new WorkingHour();
    try {
      const dateAndOwnerInDB = await WorkingHour.findOne({
        where: { owner: user, dateOfWork: createWorkingHourDto.dateOfWork },
      });

      if (dateAndOwnerInDB) {
        throw new HttpException(
          `Working hours on '${wHours.dateOfWork}' is already exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      wHours.owner = user;
      wHours.dateOfWork = createWorkingHourDto.dateOfWork;
      wHours.startTimeOfWork = createWorkingHourDto.startTimeOfWork;
      wHours.endTimeOfWork = createWorkingHourDto.endTimeOfWork;
      wHours.workDescription = createWorkingHourDto.workDescription;
      await wHours.save();
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `Working hours on '${wHours.dateOfWork}' is already exist.`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return err;
      }
    }
    return {
      owner: {
        username: wHours.owner.username,
        email: wHours.owner.email,
        role: wHours.owner.role,
      },
      dateOfWork: wHours.dateOfWork,
      startTimeOfWork: wHours.startTimeOfWork,
      endTimeOfWork: wHours.endTimeOfWork,
      workDescription: wHours.workDescription,
      createAt: wHours.createAt,
      updateAt: wHours.updateAt,
    };
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

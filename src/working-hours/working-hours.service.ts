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

  shortUserInfo(user: User) {
    delete user.id;
    delete user.pwdHash;
    delete user.currentTokenId;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpirationDate;

    return user;
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

  async findAll(user: User): Promise<WorkingHoursResponse[]> {
    try {
      const res = await WorkingHour.find({
        where: { owner: user.id },
      });
      res.map((e) => {
        e.owner = this.shortUserInfo(user);
      });

      return res;
    } catch (err) {
      return err;
    }
  }

  async findOne(id: string, user: User): Promise<WorkingHoursResponse> {
    try {
      if (!id) {
        throw new HttpException(
          `Record ${id} is not exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const res = await WorkingHour.findOne({
        where: { owner: user.id, id: id },
        relations: ['owner'],
      });

      if (!res) {
        throw new HttpException(
          `Record ${id} is not find.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      res.owner = this.shortUserInfo(res.owner);
      return res;
    } catch (err) {
      return err;
    }
  }

  async update(
    id: string,
    wHour: UpdateWorkingHourDto,
    user: User,
  ): Promise<WorkingHoursResponse> {
    if (Object.keys(wHour).length === 0) {
      throw new HttpException(
        `You must provide correct data.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!id) {
      throw new HttpException(
        `Record ${id} is not exist.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const res = await WorkingHour.findOne({
        where: { owner: user.id, id: id },
        relations: ['owner'],
      });

      if (!res) {
        throw new HttpException(
          `Record ${id} is not find.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      res.id = id;
      res.dateOfWork = wHour.dateOfWork;
      res.startTimeOfWork = wHour.startTimeOfWork;
      res.endTimeOfWork = wHour.endTimeOfWork;
      res.workDescription = wHour.workDescription;
      res.createAt = wHour.createAt;
      res.updateAt = wHour.updateAt;

      // res.owner = wHour.owner;

      await res.save();
      delete res.owner.id;
      delete res.owner.pwdHash;
      delete res.owner.currentTokenId;
      delete res.owner.resetPasswordToken;
      delete res.owner.resetPasswordExpirationDate;
      return res;
    } catch (err) {
      // if (err.code === 'ER_DUP_ENTRY') {
      //   throw new HttpException(
      //     `Polish or scientific name is already exist.`,
      //     HttpStatus.BAD_REQUEST,
      //   );
      return err;
    }

    // return `This action updates a #${id} workingHour`;
  }

  async remove(id: string, user: User) {
    try {
      if (!id) {
        throw new HttpException(
          `Record ${id} is not exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const res = await WorkingHour.findOne({
        where: { owner: user.id, id: id },
        relations: ['owner'],
      });

      if (!res) {
        throw new HttpException(
          `Record ${id} is not find.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await WorkingHour.delete(id);
    } catch (err) {
      return err;
    }
  }
}

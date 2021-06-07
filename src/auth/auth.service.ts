import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../user/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { userRoleEnum } from '../interfaces/user';

@Injectable()
export class AuthService {
  private createToken(
    currentTokenId: string,
  ): { accessToken: string; expiresIn: number } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.JWT_KEY, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOne({ currentTokenId: token });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  userPermissions(role): any {
    if (role == userRoleEnum.admin) {
      return {
        hours: { get: true, add: true, delete: true, update: true },
        users: {
          get: true,
          add: true,
          delete: true,
        },
      };
    }
    if (role == userRoleEnum.moderator) {
      return {
        hours: { get: true, add: true, delete: true, update: true },
        users: {
          get: false,
          add: false,
          delete: false,
        },
      };
    }
    if (role == userRoleEnum.user) {
      return {
        hours: { get: true, add: true, delete: true, update: true },
        users: {
          get: false,
          add: false,
          delete: false,
        },
      };
    }
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    // console.log(req);

    try {
      const user = await User.findOne({
        username: req.username,
        pwdHash: hashPwd(req.pwd),
      });

      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }

      const token = await this.createToken(await this.generateToken(user));
      const { username, email, role } = user;

      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: process.env.JWT_DOMAIN,
          httpOnly: true,
        })
        .json({
          ok: true,
          username,
          email,
          role,
          permissions: this.userPermissions(role),
        });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: false,
        domain: process.env.JWT_DOMAIN,
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}

import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { AccesToken } from './acces-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByUsername(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AccesToken> {
    return !user
      ? null
      : {
          access_token: this.jwtService.sign({
            username: user.username,
            sub: user.id,
          }),
        };
  }
}

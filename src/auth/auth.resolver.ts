import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { GqlAuthGuard } from './gql-auth.guard';
import { AccesToken } from './acces-token.entity';
import { LoggerFactory } from '../logger';

@Resolver(() => User)
export class AuthResolver {
  private logger: any = LoggerFactory.getInstance();

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query(() => AccesToken, { nullable: true })
  async login(
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    const user = await this.authService.validateUser(username, password);

    this.logger.info(`User ${user.username} just logged in`);

    return this.authService.login(user);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }
}

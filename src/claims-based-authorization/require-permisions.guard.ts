import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Permissions } from './enums/permissions.enum';
import { PERMISSIONS_KEY } from './require-permissions.decorator';

@Injectable()
export class RequirePermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const req = GqlExecutionContext.create(context).getContext().req;
    if (!req) {
      return null;
    }

    const loggedUserPermissions = req.user.userData.permissions;
    return requiredPermissions.some((role) =>
      loggedUserPermissions?.includes(role),
    );
  }
}

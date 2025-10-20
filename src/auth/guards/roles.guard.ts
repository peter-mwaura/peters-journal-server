import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;
    return requiredRoles.some((role) => role === user.role);
  }
}

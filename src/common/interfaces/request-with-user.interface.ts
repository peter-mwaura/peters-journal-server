import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: Role;
  };
}

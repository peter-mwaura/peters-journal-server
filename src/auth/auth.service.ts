import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async signUp(dto: SignupDto) {
    // fetch user email, name and password
    const { email, name, password } = dto;
    const authorName = name ?? email.split('@')[0];

    // throw an exception if user already exists
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('A user with same email already exists!');
    }

    // hash user password
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // save new user to database
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        name: authorName,
        password: hashedPassword,
      },
    });

    // remove password before returning
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      status: 'success',
      message: 'User created successfully!',
      newUser: userWithoutPassword,
    };
  }
}

import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { loginDto, SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
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
      message: 'User created successfully!',
      success: true,
      statusCode: HttpStatus.OK,
      data: userWithoutPassword,
    };
  }

  async login(dto: loginDto) {
    // fetch user email and password
    const { email, password } = dto;

    // check if user exists in the database
    const existingUser = await this.usersService.findUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException('A user with that email does not exist!');
    }

    // check if password match
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('User password is invalid!');
    }

    // remove password before returning
    const { password: _, ...userWithoutPassword } = existingUser;

    // attach token to return userWIthoutPassword
    const payload = { sub: existingUser.id, email: existingUser.email };
    const userWithToken = {
      ...userWithoutPassword,
      accessToken: await this.jwtService.signAsync(payload),
    };

    return {
      message: 'Login successful!',
      success: true,
      statusCode: HttpStatus.OK,
      data: userWithToken,
    };
  }
}

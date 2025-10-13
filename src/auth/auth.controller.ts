import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignupDto) {
    return await this.authService.signUp(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }
}

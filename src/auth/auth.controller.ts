import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { loginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() dto: SignupDto) {
    return await this.authService.signUp(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }
}

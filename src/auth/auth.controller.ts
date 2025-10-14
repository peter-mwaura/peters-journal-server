import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { loginDto, SignupDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
  @UseGuards(LocalAuthGuard)
  async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }
}

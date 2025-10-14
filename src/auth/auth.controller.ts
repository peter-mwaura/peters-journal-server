import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService, SafeUser } from './auth.service';
import { SignupDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

interface AuthenticatedUser extends Request {
  user: SafeUser;
}

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
  async login(@Req() request: AuthenticatedUser) {
    return await this.authService.login(request.user);
  }
}

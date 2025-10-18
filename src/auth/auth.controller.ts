import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import * as Jwt from 'jsonwebtoken';
import { Role } from 'src/common/enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.register(body.name, body.email, body.password, body.role || Role.USER);

    const token = Jwt.sign({ sub: user.id, email: user.email, role: user.role  }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    this.setAuthCookie(res, token);
    return { user, message: 'Registered successfully' };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(body.email, body.password);
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 24*60*60*1000 });
    return { user, message: 'Logged in successfully' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies['auth_token'];
    if (!token) return null;
    const user = await this.authService.validateUser(token);
    return user;
  }
  
  // Helper method to set secure cookie
  private setAuthCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }
}

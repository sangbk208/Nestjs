import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async loginLocal(@Request() req) {
    const user: { email: string; name: string; id: string } = req.user;
    const token = await this.authService.createJwt(
      user.email,
      user.name,
      user.id,
    );
    return {
      message: 'Login successful!',
      token,
    };
  }

  @Post('signup')
  async signUp(@Body() signDto: SignUpDto) {
    return this.authService.signUpLocal(signDto);
  }

  @Get('verify')
  @HttpCode(200)
  async confirm(@Query() query: VerifyUserDto) {
    return this.authService.verifyUser(query.token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

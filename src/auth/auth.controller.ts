import { Body, Controller, Get, HttpCode, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    async loginLocal(@Request() req) {
      const user:{email:string, name:string, id:string} = req.user;
      const token = await this.authService.createJwt(user.email, user.name, user.id)
      return{
        message: 'Login successful!',
        token
      }
    }

    @Post('signup')
    async signUp(@Body() signDto: SignUpDto) {
        return this.authService.signUpLocal(signDto);
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

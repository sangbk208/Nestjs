import { Body, Controller, Get, HttpCode, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    async loginLocal(@Request() req) {
      const user:{email:string, name:string} = req.user;
      const token = await this.authService.createJwt(user.email, user.name)
      return{
        message: 'Login successful!',
        token
      }
    }

    @Post('signup')
    async signUp(@Body() signDto: SignUpDto) {
        return this.authService.signUpLocal(signDto);
     }

     @Get('test')
    @UseGuards(AuthGuard('jwt'))
    testApi(@Request() req) {
       const user = req.user
       console.log('user', user);
       
    }
}

import { Controller, Get, Post, Body, Param, Req, UseGuards, Request, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordIDto } from './dto/change-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({type: User})
  @Get('me')
  async getMe(@Request() req){
    const {id} = req.user
    return this.usersService.getMe(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({type: User})
  @Put('change-password')
  async changePassword(@Request() req, @Body() changePasswordIDto: ChangePasswordIDto){
    const userId = req.user.id
    return this.usersService.changePassword(userId, changePasswordIDto)
  }
}
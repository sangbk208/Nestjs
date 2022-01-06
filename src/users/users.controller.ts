import { Controller, Get, Post, Body, Param, Req, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @ApiCreatedResponse({type: User})
  // @Post()
  // async create(@Body() createCatDto: CreateUserDto) {
  //   await this.usersService.create(createCatDto);
  //   return {
  //       msg:"success"
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({type: User})
  @Get('me')
  async getMe(@Request() req){
    // return this.usersService.getMe('12345');
    const user = req.user
       console.log('user', user);
  }
}
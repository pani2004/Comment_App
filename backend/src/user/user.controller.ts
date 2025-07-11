import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
@Get('me')
async getMe(@Req() req: Request) {
  const user = req.user as { userId: string };
  return this.userService.getMe(user.userId);
 }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto, editUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() dto: createUserDto) {
    return this.userService.createUser(dto);
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.userService.getUser(userId);
  }
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Patch(':id')
  editUser(@Param('id') userId: string, @Body() dto: editUserDto) {
    return this.userService.updateUser(userId, dto);
  }
  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}

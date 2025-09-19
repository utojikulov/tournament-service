import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('create')
    async createUser(@Body() dto: CreateUserDto) {
        return await this.userService.create(dto)
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.userService.getById(id)
    }
}

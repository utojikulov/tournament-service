import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService
    ) {}

    async getAllUsers() {
        return await this.prismaService.user.findMany({
        })
    }

    async create(dto: CreateUserDto) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })

        if (userExists) throw new ConflictException('Something went wrong')

        const user = {
            username: dto.username
        }

        return this.prismaService.user.create({
            data: user
        })
    }

    getById(id: string) {
        return this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })
    }
}

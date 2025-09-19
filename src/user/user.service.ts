import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
    ) {}

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

    async getCurrentUser(userId: string) {
        const cachedUser = await this.redisService.getValueFromHash(userId, 'user')
        if (cachedUser) {
            return cachedUser
        } else {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    username: true,
                    wins: true,
                    losses: true,
                    duels: true
                }
            })

            if (!user) throw new NotFoundException('User not found.')
            
            await this.redisService.setValueToHash(userId, 'user', JSON.stringify(user))

            return user
        }
    }

    getById(id: string) {
        return this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }
}

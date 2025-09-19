import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [UserService, PrismaService, ConfigService, RedisService],
  controllers: [UserController]
})
export class UserModule {}

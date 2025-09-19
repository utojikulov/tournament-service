import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UserService, PrismaService, RedisService, ConfigService],
  controllers: [UserController]
})
export class UserModule {}

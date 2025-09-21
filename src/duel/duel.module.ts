import { Module } from '@nestjs/common';
import { DuelService } from './duel.service';
import { DuelController } from './duel.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [DuelService, PrismaService, RedisService, ConfigService],
    controllers: [DuelController]
})
export class DuelModule {}

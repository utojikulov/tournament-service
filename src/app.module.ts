import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { DuelModule } from './duel/duel.module';
import { TournamentModule } from './tournament/tournament.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
        PrismaModule,
        RedisModule,
        PrismaModule,
        UserModule,
        DuelModule,
        TournamentModule,
        LeaderboardModule
    ],
})
export class AppModule {}

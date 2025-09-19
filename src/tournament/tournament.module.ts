import { TournamentController } from './tournament.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TournamentService } from './tournament.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [TournamentService, PrismaService],
  controllers: [TournamentController]
})
export class TournamentModule {}

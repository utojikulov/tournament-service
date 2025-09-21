import { TournamentController } from './tournament.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TournamentService } from './tournament.service';
import { Module } from '@nestjs/common';
import { DuelService } from 'src/duel/duel.service';

@Module({
    providers: [TournamentService, PrismaService, DuelService],
    controllers: [TournamentController]
})
export class TournamentModule {}

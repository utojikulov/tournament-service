import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Injectable()
export class TournamentService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createTournament(dto: CreateTournamentDto) {
        const tournament = await this.prismaService.tournament.create({
            data: {
                name: dto.name,
            },
            include: {
                duels: true
            }
        })

        // TODO: match generation for the first round
        return tournament
    }

    async getTournament(id: string) {
        return await this.prismaService.tournament.findUnique({
            where: {
                id
            },
            include: {
                duels: true
            }
        })
    }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTournamentDto } from './dto/create-tournament.dto'
import { DuelService } from 'src/duel/duel.service'

@Injectable()
export class TournamentService {
    private readonly logger = new Logger(TournamentService.name)

    constructor(
        private readonly prismaService: PrismaService,
        private readonly duelService: DuelService,
    ) {}

    async createTournament(dto: CreateTournamentDto) {
        this.logger.log(
            `Creating tournament "${dto.name}" with ${dto.players.length} players`,
        )

        // player count validation
        if (dto.players.length < 2) {
            throw new BadRequestException('Tournament must have at least 2 players')
        }

        if (dto.players.length % 2 !== 0) {
            this.logger.warn(
                `Tournament has odd number of players (${dto.players.length}). Some players will get byes.`,
            )
        }

        const exists = await this.prismaService.tournament.findUnique({
            where: {
                name: dto.name,
            },
        })

        if (exists)
            throw new BadRequestException(
                'Tournament with this name already exists.',
            )

        try {
            const tournament = await this.prismaService.tournament.create({
                data: {
                    name: dto.name,
                },
                include: {
                    duels: true,
                },
            })

            const duels = await this.duelService.createRound(
                tournament.id,
                dto.players,
            )

            this.logger.log(
                `Tournament "${dto.name}" created successfully with ${duels.duels.length} duels`,
            )
            return { ...tournament, duels }
        } catch (error) {
            this.logger.error(`Failed to create tournament "${dto.name}":`, error)
            throw new BadRequestException(
                'Failed to create tournament. Please check your input data.',
            )
        }
    }

    async getTournament(id: string) {
        this.logger.log(`Fetching tournament with id: ${id}`)

        const tournament = await this.prismaService.tournament.findUnique({
            where: {
                id: id,
            },
            include: {
                duels: {
                    orderBy: [{ round: 'asc' }, { createdAt: 'asc' }],
                },
            },
        })

        if (!tournament) {
            throw new BadRequestException('Tournament not found')
        }
        return tournament
    }
}

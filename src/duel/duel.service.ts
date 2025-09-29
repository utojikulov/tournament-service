import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { Duel } from 'prisma/generated'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DuelService {
    private readonly logger = new Logger(DuelService.name)

    constructor(private readonly prismaService: PrismaService) {}

    async createRound(tournamentId: string, players: string[], tx?: any) {
        if (!tx) {
            return this.prismaService.$transaction(async (transaction) => {
                return this.createRoundLogic(transaction, tournamentId, players)
            }, {
                    isolationLevel: 'Serializable',
                })
        }

        return this.createRoundLogic(tx, tournamentId, players)
    }

    async createRoundLogic(tx: any, tournamentId: string, players: string[]) {
        this.logger.log(
            `Creating tournament bracket for ${players.length} players`,
        )

        const tournament = await tx.tournament.findUnique({
            where: {id: tournamentId}
        })

        if (!tournament) throw new BadRequestException('Tournament not found')

        let currentPlayers = [...players]
        const duels: Duel[] = []
        let round = 1

        while (currentPlayers.length > 1) {
            this.logger.log(`Round ${round}: ${currentPlayers.length} players`)

            const roundDuels: Duel[] = []

            for (let i = 0; i < currentPlayers.length; i += 2) {
                const redPlayerId = currentPlayers[i]
                const bluePlayerId = currentPlayers[i + 1] || null

                const { winnerId, loserId } = this.handleDuelResult(
                    redPlayerId,
                    bluePlayerId,
                    round
                )

                const duel = await tx.duel.create({
                    data: {
                        round,
                        tournamentId,
                        redPlayerId: redPlayerId,
                        bluePlayerId: bluePlayerId ?? null,
                        winnerId: winnerId,
                        loserId: loserId
                    },
                })
                roundDuels.push(duel)
                duels.push(duel)
            }

            currentPlayers = roundDuels.map((d) => d.winnerId)
            round++
        }

        this.logger.log(`Tournament completed. Winner: ${currentPlayers[0]}`)

        return {
            duels,
            winner: currentPlayers[0],
        }
    }

    private handleDuelResult(
        redPlayer: string,
        bluePlayer: string | null,
        round: number
    ): {
        winnerId: string,
        loserId: string | null
    } {
        if (!bluePlayer) {
            this.logger.log(`Player ${redPlayer} gets a bye in round ${round}`)
            return {
                winnerId: redPlayer,
                loserId: null
            }
        }

        const winner = Math.random() < 0.5 ? redPlayer : bluePlayer
        const loser = winner === redPlayer ? bluePlayer : redPlayer
        this.logger.log(
            `Duel: ${redPlayer} vs ${bluePlayer}, winner: ${winner}`,
        )

        return {
            winnerId: winner,
            loserId: loser
        }
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { Duel } from 'prisma/generated';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DuelService {
    private readonly logger = new Logger(DuelService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async createRound(tournamentId: string, players: string[]) {
        this.logger.log(
            `Creating tournament bracket for ${players.length} players`,
        );

        let currentPlayers = players.sort(() => Math.random() - 0.5);
        const duels: Duel[] = [];
        let round = 1;

        while (currentPlayers.length > 1) {
            this.logger.log(`Round ${round}: ${currentPlayers.length} players`);

            const roundDuels: Duel[] = [];

            for (let i = 0; i < currentPlayers.length; i += 2) {
                const redPlayerId = currentPlayers[i];
                const bluePlayerId = currentPlayers[i + 1] || null;

                let winnerId;

                if (!bluePlayerId) {
                    winnerId = redPlayerId;
                    this.logger.log(`Player ${redPlayerId} gets a bye in round ${round}`);
                } else {
                    winnerId = Math.random() < 0.5 ? redPlayerId : bluePlayerId;
                    this.logger.log(
                        `Duel: ${redPlayerId} vs ${bluePlayerId}, winner: ${winnerId}`,
                    );
                }

                const duel = await this.prismaService.duel.create({
                    data: {
                        round,
                        tournamentId,
                        redPlayerId: redPlayerId,
                        bluePlayerId: bluePlayerId ?? null,
                        winnerId: winnerId,
                    },
                });
                roundDuels.push(duel);
                duels.push(duel);
            }

            currentPlayers = roundDuels.map((d) => d.winnerId);
            round++;
        }

        this.logger.log(`Tournament completed. Winner: ${currentPlayers[0]}`);

        return {
            duels,
            winner: currentPlayers[0],
        };
    }
}

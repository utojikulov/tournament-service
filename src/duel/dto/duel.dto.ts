import { IsArray, IsString } from "class-validator";

export class DuelDto {
    @IsString()
    tournamentId: string

    @IsArray()
    players: string[]
}

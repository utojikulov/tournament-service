import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class CreateTournamentDto {
    @IsString()
    name: string

    @IsArray()
    @ArrayMinSize(2)
    players: string[]
}

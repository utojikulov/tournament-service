import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post('create')
  async create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.createTournament(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tournamentService.getTournament(id);
  }
}

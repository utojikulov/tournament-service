import { Module } from '@nestjs/common';
import { DuelService } from './duel.service';
import { DuelController } from './duel.controller';

@Module({
  providers: [DuelService],
  controllers: [DuelController]
})
export class DuelModule {}

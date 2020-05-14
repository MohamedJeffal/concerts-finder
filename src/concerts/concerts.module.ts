import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { Band } from '../entities/Band';
import { Concert } from '../entities/Concert';
import { Venue } from '../entities/Venue';
import { ConcertsController } from './concerts.controller';
import { ConcertRepository } from './concerts.repository';
import { ConcertsService } from './concerts.service';

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forFeature([Concert, Band, Venue, ConcertRepository]),
  ],
  providers: [ConcertsService],
  controllers: [ConcertsController],
})
export class ConcertsModule {}

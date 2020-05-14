import { Injectable } from '@nestjs/common';
import { ConcertRepository } from './concerts.repository';
import { GetConcertDto } from './dto/get-concert.dto';
import {
  GetConcertsQueryParamsByBandIds,
  GetConcertsQueryParamsByBandIdsAndLocation,
  GetConcertsQueryParamsByLocation,
} from './dto/get-concerts-query-params.dto';

@Injectable()
export class ConcertsService {
  constructor(private readonly concertsRepository: ConcertRepository) {}

  getConcertsByBandIds(
    concertsQueryByBandIds: GetConcertsQueryParamsByBandIds,
  ) {
    return this.concertsRepository.getConcertsByBandIds(concertsQueryByBandIds);
  }

  getConcertsByLocationAndByRadius(
    concertsQueryByLocation: GetConcertsQueryParamsByLocation,
  ): Promise<GetConcertDto[]> {
    return this.concertsRepository.getConcertsByLocationAndByRadius(
      concertsQueryByLocation,
    );
  }

  getConcertsByBandIdsAndByLocationAndByRadius(
    concertsQueryByBandIdsAndLocation: GetConcertsQueryParamsByBandIdsAndLocation,
  ): Promise<GetConcertDto[]> {
    return this.concertsRepository.getConcertsByBandIdsAndByLocationAndByRadius(
      concertsQueryByBandIdsAndLocation,
    );
  }
}

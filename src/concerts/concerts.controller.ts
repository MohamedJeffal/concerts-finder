import {
  Controller,
  Get,
  Injectable,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ParseConcertsQueryParamsPipe } from '../utils/parse-concerts-query-params.pipe';
import { ConcertsService } from './concerts.service';
import { GetConcertDto } from './dto/get-concert.dto';
import { GetConcertsQueryParamsDto } from './dto/get-concerts-query-params.dto';

@Injectable()
@Controller('/api/concerts')
export class ConcertsController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly concertsService: ConcertsService,
  ) {
    this.logger.setContext('ConcertsController');
  }

  /**
   *
   * @param params - Query params used to query concerts, containing at leat location info or list of band ids
   * @throws BadRequestException|InternalServerErrorException
   */
  @Get()
  async getConcertsAroundLocation(
    @Query(new ParseConcertsQueryParamsPipe())
    params: GetConcertsQueryParamsDto,
  ): Promise<GetConcertDto[]> {
    let result;
    try {
      switch (params.type) {
        case 'by_bands':
          result = await this.concertsService.getConcertsByBandIds(params);
          break;
        case 'by_location':
          result = await this.concertsService.getConcertsByLocationAndByRadius(
            params,
          );
          break;
        case 'by_bands_and_location':
          result = await this.concertsService.getConcertsByBandIdsAndByLocationAndByRadius(
            params,
          );
          break;
      }
    } catch (error) {
      this.logger.error('getConcertsAroundLocation() %o', error);
      throw new InternalServerErrorException();
    }

    return result;
  }
}

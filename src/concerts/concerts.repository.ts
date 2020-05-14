import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Concert } from '../entities/Concert';
import { GetConcertDto } from './dto/get-concert.dto';
import {
  GetConcertsQueryParamsByBandIds,
  GetConcertsQueryParamsByBandIdsAndLocation,
  GetConcertsQueryParamsByLocation,
} from './dto/get-concerts-query-params.dto';

/**
 * Using postgis functions, we compute the distance between 2 points
 * (projected from the lat long 4326 to the meters 3857 spatial reference system)
 *
 * Then the distance is converted to km to be compared to the input
 *
 * References:
 * https://postgis.net/docs/ST_Distance.html
 * https://postgis.net/docs/ST_Transform.html
 * https://postgis.net/docs/ST_SetSRID.html
 * https://postgis.net/docs/ST_MakePoint.html
 */
const distanceBetweenTwoPointsCondition = `
(ST_Distance(
    ST_Transform(ST_SetSRID(ST_MakePoint(venue.longitude, venue.latitude), 4326), 3857),
    ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857) 
) / 1000 < :radiusInKm)
`;

@EntityRepository(Concert)
export class ConcertRepository extends Repository<Concert> {
  private buildBaseQueryBuilder(): SelectQueryBuilder<Concert> {
    return this.createQueryBuilder('concert')
      .select('band.name', 'band')
      .addSelect('venue.name', 'location')
      .addSelect('concert.date', 'date')
      .addSelect('venue.latitude', 'latitude')
      .addSelect('venue.longitude', 'longitude')
      .innerJoin('concert.band', 'band')
      .innerJoin('concert.venue', 'venue');
  }

  getConcertsByBandIds({
    bandIds,
  }: GetConcertsQueryParamsByBandIds): Promise<GetConcertDto[]> {
    return this.buildBaseQueryBuilder()
      .where('band.id IN (:...bandIds)', { bandIds })
      .orderBy('concert.date', 'DESC')
      .getRawMany();
  }

  getConcertsByLocationAndByRadius({
    longitude,
    latitude,
    radius: radiusInKm,
  }: GetConcertsQueryParamsByLocation): Promise<GetConcertDto[]> {
    return this.buildBaseQueryBuilder()
      .where(distanceBetweenTwoPointsCondition, {
        longitude,
        latitude,
        radiusInKm,
      })
      .orderBy('concert.date', 'DESC')
      .getRawMany();
  }

  getConcertsByBandIdsAndByLocationAndByRadius({
    bandIds,
    longitude,
    latitude,
    radius: radiusInKm,
  }: GetConcertsQueryParamsByBandIdsAndLocation): Promise<GetConcertDto[]> {
    return this.buildBaseQueryBuilder()
      .where('band.id IN (:...bandIds)', { bandIds })
      .andWhere(distanceBetweenTwoPointsCondition, {
        longitude,
        latitude,
        radiusInKm,
      })
      .orderBy('concert.date', 'DESC')
      .getRawMany();
  }
}

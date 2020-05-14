import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertsService } from '../../src/concerts/concerts.service';
import { Concert } from '../../src/entities/Concert';

describe('ConcertsService', () => {
  let concertsService: ConcertsService;

  const concertsRepository = {
    getConcertsByBandIds: jest.fn(),
    getConcertsByLocationAndByRadius: jest.fn(),
    getConcertsByBandIdsAndByLocationAndByRadius: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: concertsRepository,
        },
      ],
    }).compile();

    concertsService = moduleRef.get<ConcertsService>(ConcertsService);
  });

  it('[getConcertsByBandIds] should return concerts filtered by band ids from db  ordered by up coming concerts first', async () => {
    const filteredConcerts = [
      {
        date: 1571808436512,
        band: '3OH!3',
        location: 'Rivoli, Toronto, ON, Canada',
        latitude: 43.64944970000001,
        longitude: -79.3949696,
      },
      {
        date: 1559108692447,
        band: 'Arkells',
        location: 'The Garrison, Toronto, ON, Canada',
        latitude: 43.6492659,
        longitude: -79.42233209999999,
      },
      {
        date: 1550266041260,
        band: '4 Non Blondes',
        location: 'Sony Centre for the Performing Arts, Toronto, ON, Canada',
        latitude: 43.6466723,
        longitude: -79.3760205,
      },
      {
        date: 1424652665767,
        band: '3OH!3',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
      {
        date: 1359976491899,
        band: '4 Non Blondes',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
    ];

    concertsRepository.getConcertsByBandIds.mockResolvedValue(filteredConcerts);

    expect(
      await concertsService.getConcertsByBandIds({ bandIds: [1, 2, 3] }),
    ).toEqual(filteredConcerts);
  });

  it('[getConcertsByBandIds] should throw an error when query operation fails', async () => {
    concertsRepository.getConcertsByBandIds.mockRejectedValue(
      new Error('test db operation error'),
    );

    await expect(
      concertsService.getConcertsByBandIds({ bandIds: [1, 2, 3] }),
    ).rejects.toEqual(new Error('test db operation error'));
  });

  it('[getConcertsByLocationAndByRadius] should return concerts filtered by location and radius from db ordered by up coming concerts first', async () => {
    const filteredConcerts = [
      {
        date: 1577765869761,
        band: 'Oingo Boingo',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
      {
        date: 1577355392972,
        band: 'Dave Grohl',
        location: 'The Rockpile West, Toronto, ON, Canada',
        latitude: 43.6294203,
        longitude: -79.5489308,
      },
      {
        date: 1569271217188,
        band: 'Snowcake',
        location: 'Warehouse, Toronto, ON, Canada',
        latitude: 43.6501841,
        longitude: -79.3900334,
      },
      {
        date: 1569126340647,
        band: 'Del Amitri',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
    ];

    concertsRepository.getConcertsByLocationAndByRadius.mockResolvedValue(
      filteredConcerts,
    );

    expect(
      await concertsService.getConcertsByLocationAndByRadius({
        latitude: 43.6818538,
        longitude: -79.5121349,
        radius: 100,
      }),
    ).toEqual(filteredConcerts);
  });

  it('[getConcertsByLocationAndByRadius] should throw an error when query operation fails', async () => {
    concertsRepository.getConcertsByLocationAndByRadius.mockRejectedValue(
      new Error('test db operation error'),
    );

    await expect(
      concertsService.getConcertsByLocationAndByRadius({
        latitude: 43.6818538,
        longitude: -79.5121349,
        radius: 100,
      }),
    ).rejects.toEqual(new Error('test db operation error'));
  });

  it('[getConcertsByBandIdsAndByLocationAndByRadius] should return concerts filtered both by location, radius and band ids from db ordered by up coming concerts first', async () => {
    const filteredConcerts = [
      {
        date: 1571808436512,
        band: '3OH!3',
        location: 'Rivoli, Toronto, ON, Canada',
        latitude: 43.64944970000001,
        longitude: -79.3949696,
      },
      {
        date: 1559108692447,
        band: 'Arkells',
        location: 'The Garrison, Toronto, ON, Canada',
        latitude: 43.6492659,
        longitude: -79.42233209999999,
      },
      {
        date: 1550266041260,
        band: '4 Non Blondes',
        location: 'Sony Centre for the Performing Arts, Toronto, ON, Canada',
        latitude: 43.6466723,
        longitude: -79.3760205,
      },
      {
        date: 1424652665767,
        band: '3OH!3',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
      {
        date: 1359976491899,
        band: '4 Non Blondes',
        location: 'Sound Academy, Toronto, ON, Canada',
        latitude: 43.63967479999999,
        longitude: -79.3535794,
      },
    ];

    concertsRepository.getConcertsByBandIdsAndByLocationAndByRadius.mockResolvedValue(
      filteredConcerts,
    );

    expect(
      await concertsService.getConcertsByBandIdsAndByLocationAndByRadius({
        latitude: 43.6818538,
        longitude: -79.5121349,
        radius: 100,
        bandIds: [42, 6, 9],
      }),
    ).toEqual(filteredConcerts);
  });

  it('[getConcertsByBandIdsAndByLocationAndByRadius] should throw an error when query operation fails', async () => {
    concertsRepository.getConcertsByBandIdsAndByLocationAndByRadius.mockRejectedValue(
      new Error('test db operation error'),
    );

    await expect(
      concertsService.getConcertsByBandIdsAndByLocationAndByRadius({
        latitude: 43.6818538,
        longitude: -79.5121349,
        radius: 100,
        bandIds: [42, 6, 9],
      }),
    ).rejects.toEqual(new Error('test db operation error'));
  });
});

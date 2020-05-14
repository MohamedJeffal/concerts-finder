import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import * as request from 'supertest';
import { ConcertsController } from '../../src/concerts/concerts.controller';
import { ConcertsService } from '../../src/concerts/concerts.service';

describe('GET /api/concerts', () => {
  let app: INestApplication;

  const concertsService: jest.Mocked<Partial<ConcertsService>> = {
    getConcertsByBandIds: jest.fn(),
    getConcertsByLocationAndByRadius: jest.fn(),
    getConcertsByBandIdsAndByLocationAndByRadius: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: PinoLogger,
          useValue: { setContext: () => {}, error: () => {} },
        },
        {
          provide: ConcertsService,
          useValue: concertsService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return concerts matched by band ids ordered by up coming concerts first', async () => {
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
    concertsService.getConcertsByBandIds.mockResolvedValue(filteredConcerts);

    const { status, body } = await request(app.getHttpServer())
      .get('/api/concerts?bandIds=64,3,2')
      .send();

    expect({ status, body }).toEqual({
      status: 200,
      body: filteredConcerts,
    });
  });

  it('should return concerts matched by location & radius around Toronto ordered by up coming concerts first', async () => {
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
        date: 1577044931451,
        band: 'VHS or Beta',
        location: 'Air Canada Centre, Toronto, ON, Canada',
        latitude: 43.6434661,
        longitude: -79.3790989,
      },
      {
        date: 1576741788468,
        band: 'Pierce the Veil',
        location: 'Warehouse, Toronto, ON, Canada',
        latitude: 43.6501841,
        longitude: -79.3900334,
      },
    ];
    concertsService.getConcertsByLocationAndByRadius.mockResolvedValue(
      filteredConcerts,
    );

    const { status, body } = await request(app.getHttpServer())
      .get('/api/concerts?longitude=-79.5121349&latitude=43.6818538&radius=100')
      .send();

    expect({ status, body }).toEqual({
      status: 200,
      body: filteredConcerts,
    });
  });

  it('should return concerts matched both location & radius and band ids ordered by up coming concerts first', async () => {
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
    ];
    concertsService.getConcertsByBandIdsAndByLocationAndByRadius.mockResolvedValue(
      filteredConcerts,
    );

    const { status, body } = await request(app.getHttpServer())
      .get(
        '/api/concerts?longitude=-79.5121349&latitude=43.6818538&radius=100&bandIds=64,3,2',
      )
      .send();

    expect({ status, body }).toEqual({
      status: 200,
      body: filteredConcerts,
    });
  });

  it('should return 400 error for missing radius query param when filtering by location', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/concerts?longitude=-79.5121349&latitude=43.6818538')
      .send();

    expect({ status, body }).toEqual({
      status: 400,
      body: {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
      },
    });
  });

  it('should return 400 error for query param with unexpected type', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/concerts?longitude=true&latitude=43.6818538&radius=5')
      .send();

    expect({ status, body }).toEqual({
      status: 400,
      body: {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
      },
    });
  });

  it('should return 500 error when the db query has failed', async () => {
    concertsService.getConcertsByLocationAndByRadius.mockRejectedValue(
      new Error('db test error'),
    );

    const { status, body } = await request(app.getHttpServer())
      .get('/api/concerts?longitude=-79.5121349&latitude=43.6818538&radius=5')
      .send();

    expect({ status, body }).toEqual({
      status: 500,
      body: {
        statusCode: 500,
        message: 'Internal Server Error',
      },
    });
  });
});

import { getRepository, MigrationInterface } from 'typeorm';
import * as bands from '../data/bands.json';
import * as concerts from '../data/concerts.json';
import * as venues from '../data/venues.json';


export class BandInit1589223049595 implements MigrationInterface {
  public async up(): Promise<void> {
    // importing data to band table
    await getRepository('band').save(bands);

    // importing data to venue table
    await getRepository('venue').save(venues);

    // importing data to concert table
    for (let i = 1; i <= 20; i++) {
      const concertsToBeSaved = concerts
        .slice((i - 1) * 1000, i * 1000)
        .map((c) => ({
          bandId: c.bandId,
          venueId: c.venueId,
          date: c.date,
        }));

      await getRepository('concert').save(concertsToBeSaved);
    }

    const remainingConcertsToBeSaved = concerts
      .slice(20000, 20627)
      .map((c) => ({
        bandId: c.bandId,
        venueId: c.venueId,
        date: c.date,
      }));

    await getRepository('concert').save(remainingConcertsToBeSaved);
  }

  public async down(): Promise<void> {
    // Truncate all tables
    await getRepository('concert').delete({});
    await getRepository('band').delete({});
    await getRepository('venue').delete({});

    // Reset sequences
    await getRepository('band').query("SELECT setval('band_id_seq', 1, false);");
    await getRepository('band').query("SELECT setval('venue_id_seq', 1, false);");
  }
}

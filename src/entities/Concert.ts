import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Band } from './Band';
import { Venue } from './Venue';

@Index('concert_pkey', ['bandId', 'venueId', 'date'], { unique: true })
@Entity('concert', { schema: 'public' })
export class Concert {
  @Column('integer', { primary: true, name: 'band_id' })
  bandId: number;

  @Column('integer', { primary: true, name: 'venue_id' })
  venueId: number;

  @Column('bigint', { primary: true, name: 'date' })
  date: string;

  @ManyToOne(() => Band, band => band.concerts)
  @JoinColumn([{ name: 'band_id', referencedColumnName: 'id' }])
  band!: Band;

  @ManyToOne(() => Venue, venue => venue.concerts)
  @JoinColumn([{ name: 'venue_id', referencedColumnName: 'id' }])
  venue!: Venue;
}

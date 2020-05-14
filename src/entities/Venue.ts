import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Concert } from "./Concert";

@Index("venue_pkey", ["id"], { unique: true })
@Entity("venue", { schema: "public" })
export class Venue {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("float", { name: "latitude" })
  latitude: number;

  @Column("float", { name: "longitude" })
  longitude: number;

  @OneToMany(() => Concert, concert => concert.venue)
  concerts: Concert[];
}

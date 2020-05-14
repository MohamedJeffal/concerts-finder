import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Concert } from "./Concert";

@Index("band_pkey", ["id"], { unique: true })
@Entity("band", { schema: "public" })
export class Band {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @OneToMany(() => Concert, concert => concert.band)
  concerts: Concert[];
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsModule } from './concerts/concerts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ConcertsModule,
  ],
})
export class AppModule {}

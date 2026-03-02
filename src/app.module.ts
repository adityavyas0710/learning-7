import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Post, Tag } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs_db',
      entities: [User, Post, Tag],
      synchronize: false, // Use migrations in production
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Post, Tag]),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), DatabaseModule, AuthModule, NotesModule, TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

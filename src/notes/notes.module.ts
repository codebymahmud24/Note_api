import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { DatabaseProvider } from "../db/database.provider";

@Module({
  controllers: [NotesController],
  providers: [NotesService, DatabaseProvider],
  exports: [NotesService],
})
export class NotesModule {}

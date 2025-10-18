import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards, Req } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  
  @Post()
  @Roles("user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.id, dto.title, dto.content);
  }

  @Get()
   @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    // console.log(req.user);
    return this.notesService.findAll(req.user.id);
  }

  @Get("search")
  @UseGuards(JwtAuthGuard)
  async search(@Req() req,  @Query('search') search?: string,) {
    console.log(search, req.user);
    return await this.notesService.search(req.user.id, search || '');
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param("id") id: number) {
    return this.notesService.findOne(req.user.id, Number(id));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Param("id") id: number, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(req.user.id, Number(id), dto);
  }

  @Delete(":id")
  remove(@Req() req, @Param("id") id: number) {
    return this.notesService.remove(req.user.id, Number(id));
  }

  @Patch(":id/pin")
  @UseGuards(JwtAuthGuard)
  togglePin(@Req() req, @Param("id") id: number) {
    return this.notesService.togglePin(req.user.id, Number(id));
  }

  @Patch(":id/archive")
  @UseGuards(JwtAuthGuard)
  toggleArchive(@Req() req, @Param("id") id: number) {
    return this.notesService.toggleArchive(req.user.id, Number(id));
  }

  @Get('tag/:tagId')
@UseGuards(JwtAuthGuard)
async findByTag(@Req() req, @Param('tagId') tagId: number) {
  return await this.notesService.findByTag(req.user.id, Number(tagId));
}
}

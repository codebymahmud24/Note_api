import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AssignTagDto } from './dto/assign-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Roles('user')
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.createTag(dto.name);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(Number(id));
  }

  @Post('assign')
  assignTag(@Body() dto: AssignTagDto) {
    return this.tagsService.assignTag(dto.noteId, dto.tagId);
  }

  @Post('unassign')
  unassignTag(@Body() dto: AssignTagDto) {
    return this.tagsService.unassignTag(dto.noteId, dto.tagId);
  }

  @Get('note/:noteId')
  getTagsForNote(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.tagsService.getTagsForNote(Number(noteId));
  }
}

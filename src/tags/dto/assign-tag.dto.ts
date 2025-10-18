import { IsNumber } from 'class-validator';

export class AssignTagDto {
  @IsNumber()
  noteId: number;
  @IsNumber()
  tagId: number;
}

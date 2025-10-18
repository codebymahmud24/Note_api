import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9-_\s]+$/, {
    message: 'Tag name can only contain alphanumeric characters, hyphens, and underscores'
  })
  name: string;
}

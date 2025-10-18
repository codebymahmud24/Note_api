import { IS_OPTIONAL, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;

  // role is optional and defaults to user if not provided
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

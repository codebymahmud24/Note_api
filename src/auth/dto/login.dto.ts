import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from "class-validator";


export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
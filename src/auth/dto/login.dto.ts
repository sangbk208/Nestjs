import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto{
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
    
    @IsString()
    @MinLength(8)
    readonly password: string;
}
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SignUpDto{
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    readonly password: string;

    @IsNotEmpty()
    readonly name: string;    
}
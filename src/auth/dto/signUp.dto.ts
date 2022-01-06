import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpDto{
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;

    @IsNotEmpty()
    readonly name: string;    
}
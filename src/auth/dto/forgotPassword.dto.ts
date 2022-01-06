import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ForgotPasswordDto{
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
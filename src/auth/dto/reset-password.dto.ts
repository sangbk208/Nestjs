import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangePasswordIDto } from 'src/users/dto/change-password.dto';

export class ResetPasswordDto extends ChangePasswordIDto {
  @IsNotEmpty()
  @IsString()
  readonly resetPasswordToken: string;
}

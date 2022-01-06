import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, maxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
  
  @ApiProperty()
  @IsInt()
  readonly age: number;
}
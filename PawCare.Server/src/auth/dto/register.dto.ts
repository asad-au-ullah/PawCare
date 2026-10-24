import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty() @IsString() @MaxLength(100) firstName!: string;
  @ApiProperty() @IsString() @MaxLength(100) lastName!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*\d).+$/, { message: 'Password must contain a lowercase letter and a digit.' })
  password!: string;
}

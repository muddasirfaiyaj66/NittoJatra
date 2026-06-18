import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @IsString()
  password: string;
}

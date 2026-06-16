import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Rahman' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+8801712345678' })
  @Matches(/^\+8801[3-9]\d{8}$/, {
    message: 'phone must be a valid Bangladesh number (+8801XXXXXXXXX)',
  })
  phone: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'password must include upper, lower, number, and special character',
  })
  password: string;

  @ApiProperty({ enum: ['male', 'female', 'other'], example: 'male' })
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @ApiPropertyOptional({ example: 'Toyota Axio 2018' })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiPropertyOptional({ example: 'Dhaka Metro-GA-11-2233' })
  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @ApiPropertyOptional({ example: 'CAR' })
  @IsOptional()
  @IsString()
  vehicleType?: string;
}

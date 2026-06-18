import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'Ahmed Rahman' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsOptional()
  @Matches(/^\+8801[3-9]\d{8}$/, {
    message: 'phone must be a valid Bangladesh number (+8801XXXXXXXXX)',
  })
  phone?: string;

  @ApiProperty({ example: 'myPassword123' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other'], example: 'male' })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({ enum: ['user', 'admin', 'operator'], example: 'user' })
  @IsOptional()
  @IsEnum(['user', 'admin', 'operator'])
  role?: string;

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

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: 'emergency@example.com' })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.emergencyContactEmail !== '' &&
      o.emergencyContactEmail !== null &&
      o.emergencyContactEmail !== undefined,
  )
  @IsEmail()
  emergencyContactEmail?: string | null;
}

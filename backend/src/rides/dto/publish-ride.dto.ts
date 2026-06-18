import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

const SERVICE_TYPES = ['ac', 'non-ac', 'women-special', 'express'] as const;

export class PublishRideDto {
  @ApiProperty({ example: 'Mirpur' })
  @IsString()
  @MinLength(1)
  fromName: string;

  @ApiProperty({ example: 'Motijheel' })
  @IsString()
  @MinLength(1)
  toName: string;

  @ApiProperty({ example: '2026-06-16T08:00:00.000Z' })
  @IsDateString()
  departureTime: string;

  @ApiProperty({ example: 'ac' })
  @IsEnum(SERVICE_TYPES)
  serviceType: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  totalSeats: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(0)
  price: number;
}

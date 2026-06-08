import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

const SERVICE_TYPES = ['ac', 'non-ac', 'women-special', 'express'] as const;

export class CreateRideDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  routeId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  @IsMongoId()
  operatorId: string;

  @ApiProperty({ example: '2026-06-09T07:00:00.000Z' })
  @IsDateString()
  departureTime: string;

  @ApiProperty({ example: 'ac' })
  @IsEnum(SERVICE_TYPES)
  serviceType: string;

  @ApiProperty({ example: 32, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalSeats?: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  price: number;
}

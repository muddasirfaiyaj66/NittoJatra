import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const SERVICE_TYPES = ['ac', 'non-ac', 'women-special', 'express'] as const;

export class SearchRidesDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', required: false })
  @IsOptional()
  @IsMongoId()
  fromLocationId?: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2', required: false })
  @IsOptional()
  @IsMongoId()
  toLocationId?: string;

  @ApiProperty({ example: 'Mirpur', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  fromName?: string;

  @ApiProperty({ example: 'Motijheel', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  toName?: string;

  @ApiProperty({ example: '2026-06-09' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'ac', required: false })
  @IsOptional()
  @IsEnum(SERVICE_TYPES)
  serviceType?: string;
}

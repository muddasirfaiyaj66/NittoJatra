import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
] as const;

export class BookingListQueryDto {
  @ApiProperty({ example: 'pending', required: false })
  @IsOptional()
  @IsEnum(BOOKING_STATUSES)
  status?: string;

  @ApiProperty({ example: '2026-06-09', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

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
const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night'] as const;
const SEAT_PREFERENCES = ['window', 'aisle', 'front', 'back'] as const;
const GENDER_RESTRICTIONS = ['male', 'female'] as const;

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

  @ApiProperty({ example: 'morning', required: false })
  @IsOptional()
  @IsEnum(TIME_SLOTS)
  timeSlot?: string;

  @ApiProperty({ example: 'window', required: false })
  @IsOptional()
  @IsEnum(SEAT_PREFERENCES)
  seatPreference?: string;

  @ApiProperty({ example: 'female', required: false })
  @IsOptional()
  @IsEnum(GENDER_RESTRICTIONS)
  genderRestriction?: string;
}

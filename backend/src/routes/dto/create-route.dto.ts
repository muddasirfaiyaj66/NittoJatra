import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  fromLocationId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  @IsMongoId()
  toLocationId: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  distanceKm: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(1)
  estimatedMinutes: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

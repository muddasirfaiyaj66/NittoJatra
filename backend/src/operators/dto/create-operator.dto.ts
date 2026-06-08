import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

const SERVICE_TYPES = ['ac', 'non-ac', 'women-special', 'express'] as const;
const PRIMARY_TYPES = [...SERVICE_TYPES, 'mixed'] as const;

export class CreateOperatorDto {
  @ApiProperty({ example: 'BRTC City Bus' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'BRTC' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({ example: '#4F46E5', required: false })
  @IsOptional()
  @IsString()
  brandColor?: string;

  @ApiProperty({ example: 4.2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'ac' })
  @IsEnum(PRIMARY_TYPES)
  primaryType: string;

  @ApiProperty({ example: ['ac'], type: [String] })
  @IsArray()
  @IsEnum(SERVICE_TYPES, { each: true })
  serviceTypes: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

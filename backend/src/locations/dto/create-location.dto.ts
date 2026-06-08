import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'মিরপুর' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Mirpur' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'North Dhaka' })
  @IsString()
  zone: string;

  @ApiProperty({
    example: [90.3563, 23.8041],
    description: 'GeoJSON coordinates [longitude, latitude]',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { LocationResponseDto } from '../../locations/dto/location-response.dto';

@Exclude()
export class RouteResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @Type(() => LocationResponseDto)
  @ApiProperty({ type: LocationResponseDto })
  fromLocation: LocationResponseDto;

  @Expose()
  @Type(() => LocationResponseDto)
  @ApiProperty({ type: LocationResponseDto })
  toLocation: LocationResponseDto;

  @Expose()
  @ApiProperty({ example: 12 })
  distanceKm: number;

  @Expose()
  @ApiProperty({ example: 35 })
  estimatedMinutes: number;

  @Expose()
  @ApiProperty({ example: 25 })
  basePrice: number;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: 0 })
  popularityScore: number;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LocationResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'মিরপুর' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Mirpur' })
  nameEn: string;

  @Expose()
  @ApiProperty({ example: 'North Dhaka' })
  zone: string;

  @Expose()
  @ApiProperty({ example: { type: 'Point', coordinates: [90.3563, 23.8041] } })
  coordinates: { type: string; coordinates: [number, number] };

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: 0 })
  sortOrder: number;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

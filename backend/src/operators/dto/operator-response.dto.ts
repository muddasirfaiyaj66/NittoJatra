import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OperatorResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'BRTC City Bus' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'BRTC' })
  code: string;

  @Expose()
  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  logoUrl?: string;

  @Expose()
  @ApiProperty({ example: '#4F46E5' })
  brandColor: string;

  @Expose()
  @ApiProperty({ example: 4.2 })
  rating: number;

  @Expose()
  @ApiProperty({ example: 0 })
  totalRatings: number;

  @Expose()
  @ApiProperty({ example: 'ac' })
  primaryType: string;

  @Expose()
  @ApiProperty({ example: ['ac'] })
  serviceTypes: string[];

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReviewResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  booking: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  rider: string;

  @Expose()
  @ApiPropertyOptional({ example: '65f1a2b3c4d5e6f7a8b9c0d4' })
  driver?: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d5' })
  operator: string;

  @Expose()
  @ApiProperty({ example: 5 })
  rating: number;

  @Expose()
  @ApiPropertyOptional({ example: 'Great ride!' })
  comment?: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}

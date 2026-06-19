import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ComplaintResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d4' })
  _id: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  booking: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  byUser: string;

  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  againstUser: string;

  @Expose()
  @ApiProperty({ example: 'rider' })
  byRole: string;

  @Expose()
  @ApiProperty({ example: 'behavior' })
  category: string;

  @Expose()
  @ApiProperty({ example: 'The driver was very rude and drove unsafely.' })
  description: string;

  @Expose()
  @ApiProperty({ example: 'pending' })
  status: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}

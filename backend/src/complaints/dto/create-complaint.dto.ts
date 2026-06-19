import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateComplaintDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  bookingId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  @IsMongoId()
  againstUserId: string;

  @ApiProperty({ example: 'rider', enum: ['rider', 'driver'] })
  @IsEnum(['rider', 'driver'])
  byRole: string;

  @ApiProperty({ example: 'behavior' })
  @IsString()
  @MinLength(1)
  category: string;

  @ApiProperty({ example: 'The driver was very rude and drove unsafely.' })
  @IsString()
  @MinLength(5)
  description: string;
}

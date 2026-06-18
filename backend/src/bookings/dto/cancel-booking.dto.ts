import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({ example: 'Change of plans', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}

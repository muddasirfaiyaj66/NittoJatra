import { ApiProperty } from '@nestjs/swagger';
import { SeatDto } from './seat.dto';

export class SeatMapResponseDto {
  @ApiProperty({ type: [SeatDto] })
  seats: SeatDto[];

  @ApiProperty({ example: 28 })
  availableCount: number;
}

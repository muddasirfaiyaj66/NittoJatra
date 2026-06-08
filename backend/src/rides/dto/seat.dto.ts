import { ApiProperty } from '@nestjs/swagger';

export type SeatStatus = 'available' | 'booked' | 'women-only' | 'blocked';

export class SeatDto {
  @ApiProperty({ example: 'A1' })
  seatNumber: string;

  @ApiProperty({ example: 1 })
  row: number;

  @ApiProperty({ example: 1 })
  column: number;

  @ApiProperty({
    example: 'available',
    enum: ['available', 'booked', 'women-only', 'blocked'],
  })
  status: SeatStatus;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', required: false })
  bookedBy?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { OperatorResponseDto } from '../../operators/dto/operator-response.dto';
import { RouteResponseDto } from '../../routes/dto/route-response.dto';
import { SeatDto } from './seat.dto';

@Exclude()
export class RideResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @Type(() => RouteResponseDto)
  @ApiProperty({ type: RouteResponseDto })
  route: RouteResponseDto;

  @Expose()
  @Type(() => OperatorResponseDto)
  @ApiProperty({ type: OperatorResponseDto })
  operator: OperatorResponseDto;

  @Expose()
  @ApiProperty({ example: '2026-06-09T07:00:00.000Z' })
  departureTime: Date;

  @Expose()
  @ApiProperty({ example: '2026-06-09T07:35:00.000Z' })
  arrivalTime: Date;

  @Expose()
  @ApiProperty({ example: 'ac' })
  serviceType: string;

  @Expose()
  @ApiProperty({ example: 32 })
  totalSeats: number;

  @Expose()
  @ApiProperty({ example: 25 })
  price: number;

  @Expose()
  @Type(() => SeatDto)
  @ApiProperty({ type: [SeatDto] })
  seatMap: SeatDto[];

  @Expose()
  @ApiProperty({ example: 'scheduled' })
  status: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

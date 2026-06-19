import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RideResponseDto } from '../../rides/dto/ride-response.dto';

@Exclude()
class BookingUserSummaryDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0a1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'Ahmed Rahman' })
  fullName: string;

  @Expose()
  @ApiProperty({ example: '+8801712345678' })
  phone: string;
}

@Exclude()
export class BookingResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'NJ-20260609-A1B2' })
  bookingId: string;

  @Expose()
  @Type(() => BookingUserSummaryDto)
  @ApiProperty({ type: BookingUserSummaryDto })
  user: BookingUserSummaryDto;

  @Expose()
  @Type(() => RideResponseDto)
  @ApiProperty({ type: RideResponseDto })
  ride: RideResponseDto;

  @Expose()
  @ApiProperty({ example: ['A1'] })
  seats: string[];

  @Expose()
  @ApiProperty({ example: 'Ahmed Rahman' })
  passengerName: string;

  @Expose()
  @ApiProperty({ example: '+8801712345678' })
  passengerPhone: string;

  @Expose()
  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  passengerEmail: string;

  @Expose()
  @ApiProperty({ example: '1234567890', required: false })
  passengerNid?: string;

  @Expose()
  @ApiProperty({ example: 50 })
  baseFare: number;

  @Expose()
  @ApiProperty({ example: 5 })
  convenienceFee: number;

  @Expose()
  @ApiProperty({ example: 5 })
  discount: number;

  @Expose()
  @ApiProperty({ example: 50 })
  totalAmount: number;

  @Expose()
  @ApiProperty({ example: 'pending' })
  status: string;

  @Expose()
  @ApiProperty({ example: 'bkash' })
  paymentMethod: string;

  @Expose()
  @ApiProperty({ example: 'unpaid' })
  paymentStatus: string;

  @Expose()
  @ApiProperty({ example: 'NITTO10', required: false })
  promoCode?: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

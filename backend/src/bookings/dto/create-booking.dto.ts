import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

const PAYMENT_METHODS = ['bkash', 'nagad', 'rocket', 'card', 'cash'] as const;

export class CreateBookingDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  @IsMongoId()
  rideId: string;

  @ApiProperty({ example: ['A1'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  seats: string[];

  @ApiProperty({ example: 'Ahmed Rahman' })
  @IsString()
  passengerName: string;

  @ApiProperty({ example: '+8801712345678' })
  @Matches(/^\+8801[3-9]\d{8}$/, {
    message: 'phone must be a valid Bangladesh number (+8801XXXXXXXXX)',
  })
  passengerPhone: string;

  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  @IsEmail()
  passengerEmail: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  passengerNid?: string;

  @ApiProperty({ example: 'bkash' })
  @IsEnum(PAYMENT_METHODS)
  paymentMethod: string;

  @ApiProperty({ example: 'NITTO10', required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;
}

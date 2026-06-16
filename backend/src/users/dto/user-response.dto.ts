import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  _id: string;

  @Expose()
  @ApiProperty({ example: 'Ahmed Rahman' })
  fullName: string;

  @Expose()
  @ApiProperty({ example: 'ahmed@nittojatra.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: '+8801712345678' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'male' })
  gender: string;

  @Expose()
  @ApiProperty({ example: 'user' })
  role: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: 0 })
  totalTrips: number;

  @Expose()
  @ApiProperty({ example: 0 })
  totalSpent: number;

  @Expose()
  @ApiProperty({ example: 0 })
  loyaltyPoints: number;

  @Expose()
  @ApiPropertyOptional({ example: 'Toyota Axio 2018' })
  vehicleModel?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Dhaka Metro-GA-11-2233' })
  vehiclePlate?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'CAR' })
  vehicleType?: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  updatedAt?: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MessageResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty({ example: 'rider' })
  senderRole: string;

  @Expose()
  @ApiProperty({ example: 'Hello, I am ready for pickup.' })
  body: string;

  @Expose()
  @ApiProperty()
  createdAt?: Date;
}

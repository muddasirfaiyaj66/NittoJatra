import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ConversationResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty({ example: 'NJ-20260609-A1B2' })
  bookingRef: string;

  @Expose()
  @ApiProperty({ example: 'Mirpur → Motijheel' })
  title: string;

  @Expose()
  @ApiProperty({ example: 'BRTC' })
  participantName: string;

  @Expose()
  @ApiProperty({ example: 'Your booking is confirmed.' })
  lastMessage: string;

  @Expose()
  @ApiProperty()
  lastMessageAt: Date;

  @Expose()
  @ApiProperty({ example: 1 })
  unreadCount: number;

  @Expose()
  @ApiProperty({ example: true })
  online: boolean;
}

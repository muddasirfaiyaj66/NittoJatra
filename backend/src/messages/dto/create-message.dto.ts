import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'I am at the pickup point.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;
}

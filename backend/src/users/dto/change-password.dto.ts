import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../common/validators/match.validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewPass456!' })
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'newPassword must include upper, lower, number, and special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewPass456!' })
  @Match('newPassword', {
    message: 'confirmNewPassword must match newPassword',
  })
  confirmNewPassword: string;
}

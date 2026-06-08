import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDocument } from './schemas/user.schema';

export function toUserResponse(user: UserDocument | Record<string, unknown>) {
  const obj =
    typeof (user as UserDocument).toObject === 'function'
      ? (user as UserDocument).toObject()
      : user;
  return plainToInstance(UserResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

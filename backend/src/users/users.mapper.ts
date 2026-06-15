import { assignDocumentId } from '../common/helpers/dto.mapper';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDocument } from './schemas/user.schema';

export function toUserResponse(user: UserDocument | Record<string, unknown>) {
  const obj =
    typeof (user as UserDocument).toObject === 'function'
      ? (user as UserDocument).toObject()
      : user;
  const dto = plainToInstance(UserResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  return assignDocumentId(dto, obj as { _id?: { toString(): string } | string });
}

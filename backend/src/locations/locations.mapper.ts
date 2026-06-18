import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationDocument } from './schemas/location.schema';

export function toLocationResponse(
  location: LocationDocument | Record<string, unknown>,
) {
  const obj =
    typeof (location as LocationDocument).toObject === 'function'
      ? (location as LocationDocument).toObject()
      : location;
  const dto = plainToInstance(LocationResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  return assignDocumentId(
    dto,
    obj as { _id?: { toString(): string } | string },
  );
}

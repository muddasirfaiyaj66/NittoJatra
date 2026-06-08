import { plainToInstance } from 'class-transformer';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationDocument } from './schemas/location.schema';

export function toLocationResponse(
  location: LocationDocument | Record<string, unknown>,
) {
  const obj =
    typeof (location as LocationDocument).toObject === 'function'
      ? (location as LocationDocument).toObject()
      : location;
  return plainToInstance(LocationResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

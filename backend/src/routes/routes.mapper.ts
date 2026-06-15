import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { toLocationResponse } from '../locations/locations.mapper';
import { RouteResponseDto } from './dto/route-response.dto';
import { RouteDocument } from './schemas/route.schema';

export function toRouteResponse(
  route: RouteDocument | Record<string, unknown>,
) {
  const obj =
    typeof (route as RouteDocument).toObject === 'function'
      ? (route as RouteDocument).toObject()
      : route;
  const dto = plainToInstance(RouteResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  assignDocumentId(dto, obj as { _id?: { toString(): string } | string });

  const populated = obj as {
    fromLocation?: Record<string, unknown>;
    toLocation?: Record<string, unknown>;
  };
  if (populated.fromLocation) {
    dto.fromLocation = toLocationResponse(populated.fromLocation);
  }
  if (populated.toLocation) {
    dto.toLocation = toLocationResponse(populated.toLocation);
  }

  return dto;
}

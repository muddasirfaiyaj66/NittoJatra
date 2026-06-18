import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { toOperatorResponse } from '../operators/operators.mapper';
import { toRouteResponse } from '../routes/routes.mapper';
import { RideResponseDto } from './dto/ride-response.dto';
import { RideDocument } from './schemas/ride.schema';

export function toRideResponse(ride: RideDocument | Record<string, unknown>) {
  const obj =
    typeof (ride as RideDocument).toObject === 'function'
      ? (ride as RideDocument).toObject()
      : ride;
  const dto = plainToInstance(RideResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  assignDocumentId(dto, obj as { _id?: { toString(): string } | string });

  const populated = obj as {
    route?: Record<string, unknown>;
    operator?: Record<string, unknown>;
  };
  if (populated.route) {
    dto.route = toRouteResponse(populated.route);
  }
  if (populated.operator) {
    dto.operator = toOperatorResponse(populated.operator);
  }

  return dto;
}

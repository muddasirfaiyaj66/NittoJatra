import { plainToInstance } from 'class-transformer';
import { RouteResponseDto } from './dto/route-response.dto';
import { RouteDocument } from './schemas/route.schema';

export function toRouteResponse(
  route: RouteDocument | Record<string, unknown>,
) {
  const obj =
    typeof (route as RouteDocument).toObject === 'function'
      ? (route as RouteDocument).toObject()
      : route;
  return plainToInstance(RouteResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

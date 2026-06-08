import { plainToInstance } from 'class-transformer';
import { RideResponseDto } from './dto/ride-response.dto';
import { RideDocument } from './schemas/ride.schema';

export function toRideResponse(ride: RideDocument | Record<string, unknown>) {
  const obj =
    typeof (ride as RideDocument).toObject === 'function'
      ? (ride as RideDocument).toObject()
      : ride;
  return plainToInstance(RideResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

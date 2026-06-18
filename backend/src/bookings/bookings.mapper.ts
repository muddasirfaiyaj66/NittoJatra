import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { toRideResponse } from '../rides/rides.mapper';
import { BookingResponseDto } from './dto/booking-response.dto';
import { BookingDocument } from './schemas/booking.schema';

export function toBookingResponse(
  booking: BookingDocument | Record<string, unknown>,
) {
  const obj =
    typeof (booking as BookingDocument).toObject === 'function'
      ? (booking as BookingDocument).toObject()
      : booking;
  const dto = plainToInstance(BookingResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  assignDocumentId(dto, obj as { _id?: { toString(): string } | string });

  const populated = obj as { ride?: Record<string, unknown> };
  if (populated.ride) {
    dto.ride = toRideResponse(populated.ride);
  }

  return dto;
}

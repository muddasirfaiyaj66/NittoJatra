import { plainToInstance } from 'class-transformer';
import { BookingResponseDto } from './dto/booking-response.dto';
import { BookingDocument } from './schemas/booking.schema';

export function toBookingResponse(
  booking: BookingDocument | Record<string, unknown>,
) {
  const obj =
    typeof (booking as BookingDocument).toObject === 'function'
      ? (booking as BookingDocument).toObject()
      : booking;
  return plainToInstance(BookingResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

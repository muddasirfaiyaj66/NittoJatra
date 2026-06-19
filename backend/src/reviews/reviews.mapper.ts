import { plainToInstance } from 'class-transformer';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReviewDocument } from './schemas/review.schema';

export function toReviewResponse(review: any): ReviewResponseDto {
  const obj = typeof review.toObject === 'function' ? review.toObject() : review;
  
  const mapped = {
    ...obj,
    _id: String(obj._id),
    booking: String(obj.booking),
    rider: String(obj.rider),
    driver: obj.driver ? String(obj.driver) : undefined,
    operator: String(obj.operator),
  };

  return plainToInstance(ReviewResponseDto, mapped, {
    excludeExtraneousValues: true,
  });
}

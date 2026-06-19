import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { ComplaintResponseDto } from './dto/complaint-response.dto';
import { ComplaintDocument } from './schemas/complaint.schema';

export function toComplaintResponse(
  complaint: ComplaintDocument | Record<string, unknown>,
): ComplaintResponseDto {
  const obj =
    typeof (complaint as ComplaintDocument).toObject === 'function'
      ? (complaint as ComplaintDocument).toObject()
      : complaint;

  if (obj && obj.booking) {
    obj.booking = (obj.booking as { toString(): string }).toString();
  }
  if (obj && obj.byUser) {
    obj.byUser = (obj.byUser as { toString(): string }).toString();
  }
  if (obj && obj.againstUser) {
    obj.againstUser = (obj.againstUser as { toString(): string }).toString();
  }

  const dto = plainToInstance(ComplaintResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  assignDocumentId(dto, obj as { _id?: { toString(): string } | string });

  return dto;
}

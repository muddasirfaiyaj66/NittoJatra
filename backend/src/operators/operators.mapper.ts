import { plainToInstance } from 'class-transformer';
import { assignDocumentId } from '../common/helpers/dto.mapper';
import { OperatorResponseDto } from './dto/operator-response.dto';
import { OperatorDocument } from './schemas/operator.schema';

export function toOperatorResponse(
  operator: OperatorDocument | Record<string, unknown>,
) {
  const obj =
    typeof (operator as OperatorDocument).toObject === 'function'
      ? (operator as OperatorDocument).toObject()
      : operator;
  const dto = plainToInstance(OperatorResponseDto, obj, {
    excludeExtraneousValues: true,
  });
  return assignDocumentId(
    dto,
    obj as { _id?: { toString(): string } | string },
  );
}

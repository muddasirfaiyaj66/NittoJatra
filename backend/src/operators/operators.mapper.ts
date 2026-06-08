import { plainToInstance } from 'class-transformer';
import { OperatorResponseDto } from './dto/operator-response.dto';
import { OperatorDocument } from './schemas/operator.schema';

export function toOperatorResponse(
  operator: OperatorDocument | Record<string, unknown>,
) {
  const obj =
    typeof (operator as OperatorDocument).toObject === 'function'
      ? (operator as OperatorDocument).toObject()
      : operator;
  return plainToInstance(OperatorResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

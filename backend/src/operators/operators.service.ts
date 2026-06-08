import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { Operator, OperatorDocument } from './schemas/operator.schema';
import { toOperatorResponse } from './operators.mapper';

@Injectable()
export class OperatorsService {
  private readonly logger = new Logger(OperatorsService.name);

  constructor(
    @InjectModel(Operator.name)
    private readonly operatorModel: Model<OperatorDocument>,
  ) {}

  async findAll() {
    const operators = await this.operatorModel
      .find({ isActive: true })
      .sort({ name: 1 })
      .exec();
    return operators.map(toOperatorResponse);
  }

  async findById(id: string) {
    const operator = await this.operatorModel.findById(id).exec();
    if (!operator || !operator.isActive) {
      throw new NotFoundException('Operator not found');
    }
    return toOperatorResponse(operator);
  }

  async findByCode(code: string) {
    return this.operatorModel.findOne({ code }).exec();
  }

  async create(dto: CreateOperatorDto) {
    const existing = await this.operatorModel
      .findOne({ code: dto.code })
      .exec();
    if (existing) {
      throw new ConflictException('Operator code already exists');
    }

    const operator = await this.operatorModel.create(dto);
    this.logger.log(`Operator created: ${operator.code}`);
    return toOperatorResponse(operator);
  }

  async update(id: string, dto: UpdateOperatorDto) {
    if (dto.code) {
      const existing = await this.operatorModel
        .findOne({ code: dto.code, _id: { $ne: id } })
        .exec();
      if (existing) {
        throw new ConflictException('Operator code already exists');
      }
    }

    const operator = await this.operatorModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }
    return toOperatorResponse(operator);
  }

  async remove(id: string) {
    const operator = await this.operatorModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }
    this.logger.log(`Operator deactivated: ${operator.code}`);
    return { message: 'Operator deleted successfully' };
  }
}

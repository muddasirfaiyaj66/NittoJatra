import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import { toLocationResponse } from './locations.mapper';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async findAll() {
    const locations = await this.locationModel
      .find({ isActive: true })
      .sort({ zone: 1, sortOrder: 1 })
      .exec();
    return locations.map(toLocationResponse);
  }

  async findById(id: string) {
    const location = await this.locationModel.findById(id).exec();
    if (!location || !location.isActive) {
      throw new NotFoundException('Location not found');
    }
    return toLocationResponse(location);
  }

  async findByNameEn(nameEn: string) {
    return this.locationModel.findOne({ nameEn }).exec();
  }

  async search(query: string) {
    if (!query?.trim()) {
      return this.findAll();
    }

    const regex = new RegExp(query.trim(), 'i');
    const locations = await this.locationModel
      .find({
        isActive: true,
        $or: [{ name: regex }, { nameEn: regex }],
      })
      .sort({ zone: 1, sortOrder: 1 })
      .exec();

    this.logger.log(
      `Location search "${query}" returned ${locations.length} results`,
    );
    return locations.map(toLocationResponse);
  }
}

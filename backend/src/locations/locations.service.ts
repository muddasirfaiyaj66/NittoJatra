import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { aliasTermsForQuery } from './location-aliases';
import { toLocationResponse } from './locations.mapper';
import { Location, LocationDocument } from './schemas/location.schema';

const DEFAULT_COORDINATES: [number, number] = [90.4125, 23.8103];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scoreLocationMatch(query: string, location: LocationDocument): number {
  const normalized = query.trim().toLowerCase();
  const nameEn = location.nameEn.toLowerCase();
  const name = location.name.toLowerCase();

  let score = 0;
  if (nameEn === normalized || name === normalized) score += 100;
  if (nameEn.startsWith(normalized) || normalized.startsWith(nameEn))
    score += 50;
  if (name.startsWith(normalized) || normalized.startsWith(name)) score += 40;
  if (nameEn.includes(normalized) || normalized.includes(nameEn)) score += 25;
  if (name.includes(normalized) || normalized.includes(name)) score += 20;
  score -= nameEn.length * 0.05;
  return score;
}

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

  async findDocumentByName(rawName: string): Promise<LocationDocument | null> {
    return this.resolveDocumentByName(rawName);
  }

  async resolveDocumentByName(
    rawName: string,
  ): Promise<LocationDocument | null> {
    const query = rawName.trim();
    if (!query) {
      return null;
    }

    const exactRegex = new RegExp(`^${escapeRegex(query)}$`, 'i');
    const exact = await this.locationModel
      .findOne({
        isActive: true,
        $or: [{ nameEn: exactRegex }, { name: exactRegex }],
      })
      .exec();
    if (exact) {
      return exact;
    }

    for (const term of aliasTermsForQuery(query)) {
      const aliasRegex = new RegExp(`^${escapeRegex(term)}$`, 'i');
      const aliasExact = await this.locationModel
        .findOne({
          isActive: true,
          $or: [{ nameEn: aliasRegex }, { name: aliasRegex }],
        })
        .exec();
      if (aliasExact) {
        return aliasExact;
      }
    }

    const searchTerms = aliasTermsForQuery(query);
    const candidates = new Map<string, LocationDocument>();

    for (const term of searchTerms) {
      const regex = new RegExp(escapeRegex(term), 'i');
      const matches = await this.locationModel
        .find({
          isActive: true,
          $or: [{ nameEn: regex }, { name: regex }],
        })
        .limit(15)
        .exec();

      for (const match of matches) {
        candidates.set(String(match._id), match);
      }
    }

    if (candidates.size === 0) {
      return null;
    }

    const ranked = [...candidates.values()]
      .map((location) => ({
        location,
        score: scoreLocationMatch(query, location),
      }))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0];
    if (best.score <= 0) {
      return null;
    }

    this.logger.log(
      `Resolved location "${query}" → "${best.location.nameEn}" (score ${best.score.toFixed(1)})`,
    );
    return best.location;
  }

  async findOrCreateByName(rawName: string): Promise<LocationDocument> {
    const existing = await this.resolveDocumentByName(rawName);
    if (existing) {
      return existing;
    }

    const nameEn = rawName.trim();
    if (!nameEn) {
      throw new NotFoundException('Location name is required');
    }

    const location = await this.locationModel.create({
      name: nameEn,
      nameEn,
      zone: 'Custom',
      coordinates: { type: 'Point', coordinates: DEFAULT_COORDINATES },
      isActive: true,
      sortOrder: 999,
    });

    this.logger.log(`Created custom location: ${nameEn}`);
    return location;
  }

  async search(query: string) {
    if (!query?.trim()) {
      return this.findAll();
    }

    const regex = new RegExp(escapeRegex(query.trim()), 'i');
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

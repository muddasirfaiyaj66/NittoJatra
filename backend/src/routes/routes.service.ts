import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, RouteDocument } from './schemas/route.schema';
import { toRouteResponse } from './routes.mapper';

const POPULATE_OPTIONS = [
  {
    path: 'fromLocation',
    select: 'name nameEn zone coordinates sortOrder isActive',
  },
  {
    path: 'toLocation',
    select: 'name nameEn zone coordinates sortOrder isActive',
  },
];

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(
    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,
  ) {}

  async findAll() {
    const routes = await this.routeModel
      .find({ isActive: true })
      .populate(POPULATE_OPTIONS)
      .sort({ popularityScore: -1 })
      .exec();
    return routes.map(toRouteResponse);
  }

  async findById(id: string) {
    const route = await this.routeModel
      .findById(id)
      .populate(POPULATE_OPTIONS)
      .exec();
    if (!route || !route.isActive) {
      throw new NotFoundException('Route not found');
    }
    return toRouteResponse(route);
  }

  async findDocumentById(id: string) {
    const route = await this.routeModel.findById(id).exec();
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return route;
  }

  async findByLocationPair(fromId: string, toId: string) {
    const route = await this.routeModel
      .findOne({
        fromLocation: { $in: [fromId, new Types.ObjectId(fromId)] },
        toLocation: { $in: [toId, new Types.ObjectId(toId)] },
        isActive: true,
      })
      .populate(POPULATE_OPTIONS)
      .exec();

    if (!route) {
      throw new NotFoundException('Route not found for the given locations');
    }
    return toRouteResponse(route);
  }

  async findDocumentByLocationPair(fromId: string, toId: string) {
    return this.routeModel
      .findOne({
        fromLocation: { $in: [fromId, new Types.ObjectId(fromId)] },
        toLocation: { $in: [toId, new Types.ObjectId(toId)] },
        isActive: true,
      })
      .exec();
  }

  async findOrCreateByLocationPair(
    fromId: string,
    toId: string,
    defaults: { basePrice: number; distanceKm?: number; estimatedMinutes?: number },
  ) {
    const existing = await this.findDocumentByLocationPair(fromId, toId);
    if (existing) {
      return existing;
    }

    const route = await this.routeModel.create({
      fromLocation: new Types.ObjectId(fromId),
      toLocation: new Types.ObjectId(toId),
      distanceKm: defaults.distanceKm ?? 10,
      estimatedMinutes: defaults.estimatedMinutes ?? 30,
      basePrice: defaults.basePrice,
      isActive: true,
    });

    this.logger.log(`Created route: ${fromId} → ${toId}`);
    return route;
  }

  async incrementPopularity(routeId: string) {
    await this.routeModel.findByIdAndUpdate(routeId, {
      $inc: { popularityScore: 1 },
    });
  }

  async create(dto: CreateRouteDto) {
    const route = await this.routeModel.create({
      fromLocation: new Types.ObjectId(dto.fromLocationId),
      toLocation: new Types.ObjectId(dto.toLocationId),
      distanceKm: dto.distanceKm,
      estimatedMinutes: dto.estimatedMinutes,
      basePrice: dto.basePrice,
      isActive: dto.isActive ?? true,
    });

    const populated = await route.populate(POPULATE_OPTIONS);
    this.logger.log(
      `Route created: ${dto.fromLocationId} → ${dto.toLocationId}`,
    );
    return toRouteResponse(populated);
  }

  async update(id: string, dto: UpdateRouteDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.fromLocationId) {
      update.fromLocation = dto.fromLocationId;
      delete update.fromLocationId;
    }
    if (dto.toLocationId) {
      update.toLocation = dto.toLocationId;
      delete update.toLocationId;
    }

    const route = await this.routeModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .populate(POPULATE_OPTIONS)
      .exec();

    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return toRouteResponse(route);
  }

  async remove(id: string) {
    const route = await this.routeModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return { message: 'Route deleted successfully' };
  }
}

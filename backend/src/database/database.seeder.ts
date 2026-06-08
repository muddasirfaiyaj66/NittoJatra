import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Location,
  LocationDocument,
} from '../locations/schemas/location.schema';
import {
  Operator,
  OperatorDocument,
} from '../operators/schemas/operator.schema';
import { Route, RouteDocument } from '../routes/schemas/route.schema';
import { Ride, RideDocument } from '../rides/schemas/ride.schema';
import { generateSeatMap } from '../rides/helpers/seat-map.helper';
import { LOCATIONS_SEED } from './seeds/locations.seed';
import { OPERATORS_SEED } from './seeds/operators.seed';
import { ROUTES_SEED } from './seeds/routes.seed';
import { RIDES_SEED } from './seeds/rides.seed';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
    @InjectModel(Operator.name)
    private readonly operatorModel: Model<OperatorDocument>,
    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,
    @InjectModel(Ride.name)
    private readonly rideModel: Model<RideDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Starting database seed...');
    await this.seedLocations();
    await this.seedOperators();
    await this.seedRoutes();
    await this.seedRides();
    this.logger.log('Database seed completed');
  }

  private async seedLocations() {
    for (const entry of LOCATIONS_SEED) {
      await this.locationModel.updateOne(
        { nameEn: entry.nameEn },
        {
          $set: {
            name: entry.name,
            nameEn: entry.nameEn,
            zone: entry.zone,
            coordinates: {
              type: 'Point',
              coordinates: entry.coordinates,
            },
            sortOrder: entry.sortOrder,
            isActive: true,
          },
        },
        { upsert: true },
      );
    }
    this.logger.log(`Seeded ${LOCATIONS_SEED.length} locations`);
  }

  private async seedOperators() {
    for (const entry of OPERATORS_SEED) {
      await this.operatorModel.updateOne(
        { code: entry.code },
        {
          $set: {
            name: entry.name,
            code: entry.code,
            brandColor: entry.brandColor,
            primaryType: entry.primaryType,
            rating: entry.rating,
            serviceTypes: entry.serviceTypes,
            isActive: true,
          },
        },
        { upsert: true },
      );
    }
    this.logger.log(`Seeded ${OPERATORS_SEED.length} operators`);
  }

  private async seedRoutes() {
    for (const entry of ROUTES_SEED) {
      const fromLocation = await this.locationModel
        .findOne({ nameEn: entry.fromNameEn })
        .exec();
      const toLocation = await this.locationModel
        .findOne({ nameEn: entry.toNameEn })
        .exec();

      if (!fromLocation || !toLocation) {
        this.logger.warn(
          `Skipping route ${entry.fromNameEn} → ${entry.toNameEn}: location not found`,
        );
        continue;
      }

      await this.routeModel.updateOne(
        {
          fromLocation: fromLocation._id,
          toLocation: toLocation._id,
        },
        {
          $set: {
            fromLocation: fromLocation._id,
            toLocation: toLocation._id,
            distanceKm: entry.distanceKm,
            estimatedMinutes: entry.estimatedMinutes,
            basePrice: entry.basePrice,
            isActive: true,
          },
        },
        { upsert: true },
      );
    }
    this.logger.log(`Seeded ${ROUTES_SEED.length} routes`);
  }

  private async seedRides() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const entry of RIDES_SEED) {
      const fromLocation = await this.locationModel
        .findOne({ nameEn: entry.fromNameEn })
        .exec();
      const toLocation = await this.locationModel
        .findOne({ nameEn: entry.toNameEn })
        .exec();
      const operator = await this.operatorModel
        .findOne({ code: entry.operatorCode })
        .exec();

      if (!fromLocation || !toLocation || !operator) {
        this.logger.warn(
          `Skipping ride ${entry.fromNameEn} → ${entry.toNameEn}: missing references`,
        );
        continue;
      }

      const route = await this.routeModel
        .findOne({
          fromLocation: fromLocation._id,
          toLocation: toLocation._id,
        })
        .exec();

      if (!route) {
        this.logger.warn(
          `Skipping ride ${entry.fromNameEn} → ${entry.toNameEn}: route not found`,
        );
        continue;
      }

      const departureTime = new Date(today);
      departureTime.setHours(entry.departureHour, entry.departureMinute, 0, 0);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + route.estimatedMinutes);

      const totalSeats = entry.totalSeats ?? 32;
      const price = route.basePrice + (entry.priceOffset ?? 0);
      const seatMap = generateSeatMap(totalSeats, entry.serviceType);

      await this.rideModel.updateOne(
        {
          route: route._id,
          operator: operator._id,
          departureTime,
        },
        {
          $set: {
            route: route._id,
            operator: operator._id,
            departureTime,
            arrivalTime,
            serviceType: entry.serviceType,
            totalSeats,
            price,
            seatMap,
            status: 'scheduled',
          },
        },
        { upsert: true },
      );
    }
    this.logger.log(`Seeded ${RIDES_SEED.length} rides for today`);
  }
}

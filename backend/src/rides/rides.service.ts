import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoutesService } from '../routes/routes.service';
import { LocationsService } from '../locations/locations.service';
import { OperatorsService } from '../operators/operators.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { PublishRideDto } from './dto/publish-ride.dto';
import { SearchRidesDto } from './dto/search-rides.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { generateSeatMap } from './helpers/seat-map.helper';
import { Ride, RideDocument } from './schemas/ride.schema';
import { toRideResponse } from './rides.mapper';

const POPULATE_OPTIONS = [
  {
    path: 'route',
    populate: [
      { path: 'fromLocation', select: 'name nameEn zone' },
      { path: 'toLocation', select: 'name nameEn zone' },
    ],
  },
  {
    path: 'operator',
    select: 'name code brandColor rating primaryType serviceTypes',
  },
];

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(
    @InjectModel(Ride.name) private readonly rideModel: Model<RideDocument>,
    private readonly routesService: RoutesService,
    private readonly locationsService: LocationsService,
    private readonly operatorsService: OperatorsService,
  ) {}

  async findToday(date?: string) {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const { start, end } = this.getDayBounds(day);
    const rides = await this.rideModel
      .find({
        departureTime: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' },
        seatMap: { $elemMatch: { status: { $in: ['available', 'women-only'] } } },
      })
      .populate(POPULATE_OPTIONS)
      .sort({ departureTime: 1 })
      .exec();

    return rides.map(toRideResponse);
  }

  async findTodayIds(date?: string): Promise<string[]> {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const { start, end } = this.getDayBounds(day);
    const rides = await this.rideModel
      .find({
        departureTime: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' },
      })
      .select('_id')
      .exec();

    return rides.map((ride) => String(ride._id));
  }

  async findScheduledRideIds(fromDate?: string): Promise<string[]> {
    const day = fromDate ?? new Date().toISOString().slice(0, 10);
    const { start } = this.getDayBounds(day);
    const rides = await this.rideModel
      .find({
        departureTime: { $gte: start },
        status: { $ne: 'cancelled' },
      })
      .select('_id')
      .exec();

    return rides.map((ride) => String(ride._id));
  }

  async search(dto: SearchRidesDto) {
    let fromLocationId = dto.fromLocationId;
    let toLocationId = dto.toLocationId;

    if ((!fromLocationId || !toLocationId) && dto.fromName && dto.toName) {
      const fromLocation = await this.locationsService.resolveDocumentByName(
        dto.fromName,
      );
      const toLocation = await this.locationsService.resolveDocumentByName(
        dto.toName,
      );

      if (!fromLocation || !toLocation) {
        this.logger.log(
          `No locations found for "${dto.fromName}" → "${dto.toName}"`,
        );
        return [];
      }

      fromLocationId = String(fromLocation._id);
      toLocationId = String(toLocation._id);
    }

    if (!fromLocationId || !toLocationId) {
      return [];
    }

    const route = await this.routesService.findDocumentByLocationPair(
      fromLocationId,
      toLocationId,
    );

    if (!route) {
      this.logger.log(
        `No route found for ${dto.fromLocationId} → ${dto.toLocationId}`,
      );
      return [];
    }

    const { start, end } = this.getDayBounds(dto.date);
    const filter: Record<string, unknown> = {
      route: route._id,
      departureTime: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' },
      // Only return rides that have at least one bookable seat
      seatMap: { $elemMatch: { status: { $in: ['available', 'women-only'] } } },
    };

    if (dto.serviceType) {
      filter.serviceType = dto.serviceType;
    }

    const rides = await this.rideModel
      .find(filter)
      .populate(POPULATE_OPTIONS)
      .sort({ departureTime: 1 })
      .exec();

    return rides.map(toRideResponse);
  }

  async findById(id: string) {
    const ride = await this.rideModel
      .findById(id)
      .populate(POPULATE_OPTIONS)
      .exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return toRideResponse(ride);
  }

  async findDocumentById(id: string) {
    const ride = await this.rideModel.findById(id).exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return ride;
  }

  async getSeatMap(rideId: string) {
    const ride = await this.rideModel.findById(rideId).exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    const availableCount = ride.seatMap.filter(
      (seat) => seat.status === 'available' || seat.status === 'women-only',
    ).length;

    return {
      seats: ride.seatMap,
      availableCount,
    };
  }

  async holdSeat(rideId: string, seatNumber: string, userId: string) {
    const ride = await this.rideModel.findById(rideId).exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    const seat = ride.seatMap.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      throw new NotFoundException(`Seat ${seatNumber} not found`);
    }

    if (seat.status === 'booked' || seat.status === 'blocked') {
      throw new ConflictException(`Seat ${seatNumber} is not available`);
    }

    seat.status = 'booked';
    seat.bookedBy = userId;
    ride.markModified('seatMap');
    await ride.save();

    this.logger.log(`Seat ${seatNumber} held on ride ${rideId} by ${userId}`);
    return seat;
  }

  async releaseSeat(rideId: string, seatNumber: string) {
    const ride = await this.rideModel.findById(rideId).exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    const seat = ride.seatMap.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      throw new NotFoundException(`Seat ${seatNumber} not found`);
    }

    const isWomenSpecial = ride.serviceType === 'women-special';
    seat.status = isWomenSpecial && seat.row <= 2 ? 'women-only' : 'available';
    delete seat.bookedBy;
    ride.markModified('seatMap');
    await ride.save();

    this.logger.log(`Seat ${seatNumber} released on ride ${rideId}`);
    return seat;
  }

  async create(dto: CreateRideDto, driverUserId?: string) {
    const route = await this.routesService.findDocumentById(dto.routeId);
    const departureTime = new Date(dto.departureTime);
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + route.estimatedMinutes);

    const totalSeats = dto.totalSeats ?? 32;
    const seatMap = generateSeatMap(totalSeats, dto.serviceType);

    const ride = await this.rideModel.create({
      route: dto.routeId,
      operator: dto.operatorId,
      ...(driverUserId ? { driverUserId } : {}),
      departureTime,
      arrivalTime,
      serviceType: dto.serviceType,
      totalSeats,
      price: dto.price,
      seatMap,
    });

    const populated = await ride.populate(POPULATE_OPTIONS);
    this.logger.log(`Ride created for route ${dto.routeId}`);
    return toRideResponse(populated);
  }

  async publishForOperator(dto: PublishRideDto, driverUserId?: string) {
    const fromLocation = await this.locationsService.findOrCreateByName(
      dto.fromName,
    );
    const toLocation = await this.locationsService.findOrCreateByName(
      dto.toName,
    );

    const route = await this.routesService.findOrCreateByLocationPair(
      String(fromLocation._id),
      String(toLocation._id),
      { basePrice: dto.price },
    );

    const operator = await this.operatorsService.findDocumentForServiceType(
      dto.serviceType,
    );

    if (!operator) {
      throw new NotFoundException('No active operator is available');
    }

    return this.create(
      {
        routeId: String(route._id),
        operatorId: String(operator._id),
        departureTime: dto.departureTime,
        serviceType: dto.serviceType,
        totalSeats: dto.totalSeats,
        price: dto.price,
      },
      driverUserId,
    );
  }

  async findByDriver(driverUserId: string, date?: string) {
    const filter: Record<string, unknown> = {
      driverUserId,
      status: { $ne: 'cancelled' },
    };

    if (date) {
      const { start, end } = this.getDayBounds(date);
      filter.departureTime = { $gte: start, $lte: end };
    }

    const rides = await this.rideModel
      .find(filter)
      .populate(POPULATE_OPTIONS)
      .sort({ departureTime: 1 })
      .exec();

    return rides.map(toRideResponse);
  }

  async update(id: string, dto: UpdateRideDto) {
    const existing = await this.rideModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Ride not found');
    }

    const update: Record<string, unknown> = {};
    if (dto.routeId) update.route = dto.routeId;
    if (dto.operatorId) update.operator = dto.operatorId;
    if (dto.serviceType) update.serviceType = dto.serviceType;
    if (dto.totalSeats) update.totalSeats = dto.totalSeats;
    if (dto.price !== undefined) update.price = dto.price;

    if (dto.departureTime) {
      const routeId = dto.routeId ?? String(existing.route);
      const route = await this.routesService.findDocumentById(routeId);
      const departureTime = new Date(dto.departureTime);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + route.estimatedMinutes);
      update.departureTime = departureTime;
      update.arrivalTime = arrivalTime;
    }

    const ride = await this.rideModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .populate(POPULATE_OPTIONS)
      .exec();

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return toRideResponse(ride);
  }

  async remove(id: string) {
    const ride = await this.rideModel
      .findByIdAndUpdate(id, { status: 'cancelled' }, { new: true })
      .exec();
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return { message: 'Ride cancelled successfully' };
  }

  private getDayBounds(dateStr: string) {
    const start = new Date(`${dateStr}T00:00:00`);
    const end = new Date(`${dateStr}T23:59:59.999`);
    return { start, end };
  }
}

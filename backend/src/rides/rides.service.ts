import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoutesService } from '../routes/routes.service';
import { CreateRideDto } from './dto/create-ride.dto';
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
  ) {}

  async search(dto: SearchRidesDto) {
    const route = await this.routesService.findDocumentByLocationPair(
      dto.fromLocationId,
      dto.toLocationId,
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

  async create(dto: CreateRideDto) {
    const route = await this.routesService.findDocumentById(dto.routeId);
    const departureTime = new Date(dto.departureTime);
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + route.estimatedMinutes);

    const totalSeats = dto.totalSeats ?? 32;
    const seatMap = generateSeatMap(totalSeats, dto.serviceType);

    const ride = await this.rideModel.create({
      route: dto.routeId,
      operator: dto.operatorId,
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

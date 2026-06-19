import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from '../common/guards/roles.guard';
import { OperatorsModule } from '../operators/operators.module';
import { LocationsModule } from '../locations/locations.module';
import { RoutesModule } from '../routes/routes.module';
import { Ride, RideSchema } from './schemas/ride.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ride.name, schema: RideSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    RoutesModule,
    OperatorsModule,
    LocationsModule,
  ],
  controllers: [RidesController],
  providers: [RidesService, RolesGuard],
  exports: [RidesService, MongooseModule],
})
export class RidesModule {}

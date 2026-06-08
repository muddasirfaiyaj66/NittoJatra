import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from '../locations/schemas/location.schema';
import { Operator, OperatorSchema } from '../operators/schemas/operator.schema';
import { Route, RouteSchema } from '../routes/schemas/route.schema';
import { Ride, RideSchema } from '../rides/schemas/ride.schema';
import { DatabaseSeeder } from './database.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Operator.name, schema: OperatorSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Ride.name, schema: RideSchema },
    ]),
  ],
  providers: [DatabaseSeeder],
})
export class DatabaseModule {}

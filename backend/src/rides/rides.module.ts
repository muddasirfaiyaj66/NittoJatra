import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoutesModule } from '../routes/routes.module';
import { Ride, RideSchema } from './schemas/ride.schema';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    RoutesModule,
  ],
  controllers: [RidesController],
  providers: [RidesService, RolesGuard],
  exports: [RidesService, MongooseModule],
})
export class RidesModule {}

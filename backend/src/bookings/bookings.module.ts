import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RoutesModule } from '../routes/routes.module';
import { RidesModule } from '../rides/rides.module';
import { UsersModule } from '../users/users.module';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    AuthModule,
    RidesModule,
    UsersModule,
    RoutesModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService, MongooseModule],
})
export class BookingsModule {}

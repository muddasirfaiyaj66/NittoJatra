import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateRideDto } from './dto/create-ride.dto';
import { PublishRideDto } from './dto/publish-ride.dto';
import { RideResponseDto } from './dto/ride-response.dto';
import { SearchRidesDto } from './dto/search-rides.dto';
import { SeatMapResponseDto } from './dto/seat-map-response.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { RidesService } from './rides.service';

@ApiTags('rides')
@Controller({ path: 'rides', version: '1' })
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search rides by route and date' })
  @ApiQuery({ name: 'fromLocationId', required: false })
  @ApiQuery({ name: 'toLocationId', required: false })
  @ApiQuery({ name: 'fromName', required: false, example: 'Mirpur' })
  @ApiQuery({ name: 'toName', required: false, example: 'Motijheel' })
  @ApiQuery({ name: 'date', required: true, example: '2026-06-09' })
  @ApiQuery({ name: 'serviceType', required: false })
  @ApiQuery({ name: 'timeSlot', required: false, enum: ['morning', 'afternoon', 'evening', 'night'] })
  @ApiQuery({ name: 'seatPreference', required: false, enum: ['window', 'aisle', 'front', 'back'] })
  @ApiQuery({ name: 'genderRestriction', required: false, enum: ['male', 'female'] })
  @ApiResponse({ status: 200, type: [RideResponseDto] })
  search(
    @Query('fromLocationId') fromLocationId?: string,
    @Query('toLocationId') toLocationId?: string,
    @Query('fromName') fromName?: string,
    @Query('toName') toName?: string,
    @Query('date') date?: string,
    @Query('serviceType') serviceType?: string,
    @Query('timeSlot') timeSlot?: string,
    @Query('seatPreference') seatPreference?: string,
    @Query('genderRestriction') genderRestriction?: string,
  ) {
    const dto: SearchRidesDto = {
      fromLocationId,
      toLocationId,
      fromName,
      toName,
      date: date ?? new Date().toISOString().slice(0, 10),
      serviceType,
      timeSlot,
      seatPreference,
      genderRestriction,
    };
    return this.ridesService.search(dto);
  }

  @Public()
  @Get('today')
  @ApiOperation({ summary: 'List all rides departing today' })
  @ApiQuery({ name: 'date', required: false, example: '2026-06-09' })
  @ApiResponse({ status: 200, type: [RideResponseDto] })
  findToday(@Query('date') date?: string) {
    return this.ridesService.findToday(date);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('operator', 'admin')
  @Post('publish')
  @ApiOperation({ summary: 'Publish a ride for an existing route (captain)' })
  @ApiResponse({ status: 201, type: RideResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  publish(
    @CurrentUser() user: { userId: string },
    @Body() dto: PublishRideDto,
  ) {
    return this.ridesService.publishForOperator(dto, user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: "List current driver's own posted rides" })
  @ApiQuery({ name: 'date', required: false, example: '2026-06-18' })
  @ApiResponse({ status: 200, type: [RideResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyRides(
    @CurrentUser() user: { userId: string },
    @Query('date') date?: string,
  ) {
    return this.ridesService.findByDriver(user.userId, date);
  }

  @Public()
  @Get(':id/seats')
  @ApiOperation({ summary: 'Get seat map for a ride' })
  @ApiResponse({ status: 200, type: SeatMapResponseDto })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  getSeatMap(@Param('id') id: string) {
    return this.ridesService.getSeatMap(id);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiResponse({ status: 200, type: RideResponseDto })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  findById(@Param('id') id: string) {
    return this.ridesService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create ride (admin only)' })
  @ApiResponse({ status: 201, type: RideResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateRideDto) {
    return this.ridesService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update ride (admin only)' })
  @ApiResponse({ status: 200, type: RideResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() dto: UpdateRideDto) {
    return this.ridesService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel ride (admin only)' })
  @ApiResponse({ status: 200, description: 'Ride cancelled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.ridesService.remove(id);
  }
}

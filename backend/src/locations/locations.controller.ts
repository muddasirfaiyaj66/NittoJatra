import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller({ path: 'locations', version: '1' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active Dhaka locations' })
  @ApiResponse({ status: 200, type: [LocationResponseDto] })
  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search locations by name' })
  @ApiQuery({ name: 'q', required: true, example: 'Mirpur' })
  @ApiResponse({ status: 200, type: [LocationResponseDto] })
  search(@Query('q') q: string) {
    return this.locationsService.search(q);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, type: LocationResponseDto })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findById(@Param('id') id: string) {
    return this.locationsService.findById(id);
  }
}

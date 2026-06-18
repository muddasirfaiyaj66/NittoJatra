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
import { CreateRouteDto } from './dto/create-route.dto';
import { RouteResponseDto } from './dto/route-response.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RoutesService } from './routes.service';

@ApiTags('routes')
@Controller({ path: 'routes', version: '1' })
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active routes' })
  @ApiResponse({ status: 200, type: [RouteResponseDto] })
  findAll() {
    return this.routesService.findAll();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Find route by from/to location IDs' })
  @ApiQuery({ name: 'fromId', required: true })
  @ApiQuery({ name: 'toId', required: true })
  @ApiResponse({ status: 200, type: RouteResponseDto })
  @ApiResponse({ status: 404, description: 'Route not found' })
  search(@Query('fromId') fromId: string, @Query('toId') toId: string) {
    return this.routesService.findByLocationPair(fromId, toId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiResponse({ status: 200, type: RouteResponseDto })
  @ApiResponse({ status: 404, description: 'Route not found' })
  findById(@Param('id') id: string) {
    return this.routesService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create route (admin only)' })
  @ApiResponse({ status: 201, type: RouteResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update route (admin only)' })
  @ApiResponse({ status: 200, type: RouteResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routesService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete route (admin only)' })
  @ApiResponse({ status: 200, description: 'Route deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}

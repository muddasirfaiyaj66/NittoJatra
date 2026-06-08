import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { OperatorResponseDto } from './dto/operator-response.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { OperatorsService } from './operators.service';

@ApiTags('operators')
@Controller({ path: 'operators', version: '1' })
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all active operators' })
  @ApiResponse({ status: 200, type: [OperatorResponseDto] })
  findAll() {
    return this.operatorsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get operator by ID' })
  @ApiResponse({ status: 200, type: OperatorResponseDto })
  @ApiResponse({ status: 404, description: 'Operator not found' })
  findById(@Param('id') id: string) {
    return this.operatorsService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create operator (admin only)' })
  @ApiResponse({ status: 201, type: OperatorResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateOperatorDto) {
    return this.operatorsService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update operator (admin only)' })
  @ApiResponse({ status: 200, type: OperatorResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() dto: UpdateOperatorDto) {
    return this.operatorsService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete operator (admin only)' })
  @ApiResponse({ status: 200, description: 'Operator deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.operatorsService.remove(id);
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintResponseDto } from './dto/complaint-response.dto';
import { ComplaintsService } from './complaints.service';

@ApiTags('complaints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'complaints', version: '1' })
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @ApiOperation({
    summary: 'File a new complaint (Rider -> Driver/Operator or Driver -> Rider)',
  })
  @ApiResponse({ status: 201, type: ComplaintResponseDto })
  @ApiResponse({ status: 400, description: 'Validation or logic error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden action' })
  @ApiResponse({ status: 404, description: 'Booking or User not found' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateComplaintDto,
  ) {
    return this.complaintsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get complaints filed by or against the current user',
  })
  @ApiResponse({ status: 200, type: [ComplaintResponseDto] })
  findMyComplaints(@CurrentUser() user: { userId: string }) {
    return this.complaintsService.findByUser(user.userId);
  }
}

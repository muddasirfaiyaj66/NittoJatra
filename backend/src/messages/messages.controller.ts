import {
  Body,
  Controller,
  Get,
  Param,
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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List chat conversations for the current user' })
  @ApiResponse({ status: 200, type: [ConversationResponseDto] })
  listConversations(@CurrentUser() user: { userId: string; role: string }) {
    return this.messagesService.listForUser(user.userId, user.role);
  }

  @Get('conversations/booking/:bookingRef')
  @ApiOperation({ summary: 'Get or create a conversation for a booking' })
  @ApiResponse({ status: 200, type: ConversationResponseDto })
  ensureFromBooking(
    @CurrentUser() user: { userId: string; role: string },
    @Param('bookingRef') bookingRef: string,
  ) {
    return this.messagesService.ensureFromBookingRef(
      bookingRef,
      user.userId,
      user.role,
    );
  }

  @Get('conversations/:conversationId')
  @ApiOperation({ summary: 'List messages in a conversation' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({ status: 200, description: 'Paginated messages' })
  getMessages(
    @CurrentUser() user: { userId: string; role: string },
    @Param('conversationId') conversationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.messagesService.getMessages(
      conversationId,
      user.userId,
      user.role,
      Number(page ?? 1),
      Number(limit ?? 50),
    );
  }

  @Post('conversations/:conversationId')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  sendMessage(
    @CurrentUser() user: { userId: string; role: string },
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(
      conversationId,
      user.userId,
      user.role,
      dto,
    );
  }
}

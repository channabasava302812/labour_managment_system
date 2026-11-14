import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BffService } from './bff.service';

@Controller('bff')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  // GET /api/bff/summary?date=YYYY-MM-DD
  @Get('summary')
  getSummary(@Query('date') date?: string) {
    return this.bffService.getDashboardSummary(date);
  }

  // POST /api/bff/chat
  @Post('chat')
  chatWithAi(@Body('message') message: string) {
    return this.bffService.forwardToPythonChatbot(message || '');
  }
}
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { LabourService } from './labour.service';
import { CreateLabourDto } from './dto/create-labour.dto';
import { LogAttendanceDto } from './dto/log-attendance.dto';

@Controller('labours')
export class LabourController {
  constructor(private readonly labourService: LabourService) {}

  // POST /api/labours (Onboard labour)
  @Post()
  onboard(@Body() dto: CreateLabourDto) {
    return this.labourService.onboardLabour(dto);
  }

  // GET /api/labours (Get all with search & skill filter)
  @Get()
  getAll(@Query('search') search?: string, @Query('skill') skill?: string) {
    return this.labourService.getAllLabours(search, skill);
  }

  // GET /api/labours/attendance/daily?date=2026-11-14
  @Get('attendance/daily')
  getDailySheet(@Query('date') date: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.labourService.getDailyAttendanceSheet(targetDate);
  }

  // POST /api/labours/attendance (Mark attendance & auto calculate wage)
  @Post('attendance')
  logAttendance(@Body() dto: LogAttendanceDto) {
    return this.labourService.logAttendance(dto);
  }

  // GET /api/labours/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.labourService.getLabourById(+id);
  }

  // PUT /api/labours/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() attrs: any) {
    return this.labourService.updateLabour(+id, attrs);
  }

  // DELETE /api/labours/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.labourService.deleteLabour(+id);
  }
}
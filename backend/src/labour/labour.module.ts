import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Labour } from './entities/labour.entity';
import { Attendance } from './entities/attendance.entity';
import { LabourService } from './labour.service';
import { LabourController } from './labour.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Labour, Attendance])],
  controllers: [LabourController],
  providers: [LabourService],
  exports: [LabourService], // Exported so BFF can use it!
})
export class LabourModule implements OnModuleInit {
  constructor(private labourService: LabourService) {}

  // Auto-seeds demo labours on startup if the database is empty
  async onModuleInit() {
    await this.labourService.seedDemoLabours();
  }
}
import { Module } from '@nestjs/common';
import { BffService } from './bff.service';
import { BffController } from './bff.controller';
import { LabourModule } from '../labour/labour.module';

@Module({
  imports: [LabourModule], // Imports LabourModule to query workers and wages
  controllers: [BffController],
  providers: [BffService],
})
export class BffModule {}
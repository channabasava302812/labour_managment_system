import { IsNotEmpty, IsNumber, IsEnum, IsDateString, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus, ShiftType } from '../entities/attendance.entity';

export class LogAttendanceDto {
  @IsNotEmpty({ message: 'Labour ID is required' })
  @IsNumber()
  labourId: number;

  @IsNotEmpty({ message: 'Date is required (YYYY-MM-DD)' })
  @IsDateString()
  date: string; // e.g., '2026-11-14'

  @IsNotEmpty({ message: 'Attendance status is required' })
  @IsEnum(AttendanceStatus, {
    message: 'Status must be PRESENT, HALF_DAY, or ABSENT',
  })
  status: AttendanceStatus;

  @IsEnum(ShiftType)
  shift?: ShiftType;

  @IsOptional()
  @IsString()
  remarks?: string;
}
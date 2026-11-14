import { IsNotEmpty, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { LabourSkill, LabourStatus } from '../entities/labour.entity';

export class CreateLabourDto {
  @IsNotEmpty({ message: 'Labour name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Skill trade is required' })
  @IsEnum(LabourSkill, {
    message: 'Skill must be Mason, Electrician, Carpenter, Welder, Plumber, Painter, or Helper',
  })
  skill: LabourSkill;

  @IsNotEmpty({ message: 'Daily wage rate is required' })
  @IsNumber()
  @Min(100, { message: 'Daily wage must be at least 100' })
  dailyWage: number;

  @IsEnum(LabourStatus)
  status?: LabourStatus;
}
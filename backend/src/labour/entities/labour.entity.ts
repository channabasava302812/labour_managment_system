import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Attendance } from './attendance.entity';

export enum LabourStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum LabourSkill {
  MASON = 'Mason',
  ELECTRICIAN = 'Electrician',
  CARPENTER = 'Carpenter',
  WELDER = 'Welder',
  PLUMBER = 'Plumber',
  PAINTER = 'Painter',
  HELPER = 'Helper',
}

@Entity('labours')
export class Labour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: LabourSkill,
    default: LabourSkill.HELPER,
  })
  skill: LabourSkill;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  dailyWage: number;

  @Column({
    type: 'enum',
    enum: LabourStatus,
    default: LabourStatus.ACTIVE,
  })
  status: LabourStatus;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  joinedDate: string;

  // One Labour has Many Attendance records
  @OneToMany(() => Attendance, (attendance) => attendance.labour, {
    cascade: true,
  })
  attendances: Attendance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
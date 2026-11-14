import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Labour } from './labour.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  HALF_DAY = 'HALF_DAY',
  ABSENT = 'ABSENT',
}

export enum ShiftType {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

@Entity('attendances')
// Enforces that one labour can only have one attendance log per date
@Unique(['labour', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.DAY,
  })
  shift: ShiftType;

  // Automatically computed: 100% of wage for PRESENT, 50% for HALF_DAY, 0 for ABSENT
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  calculatedWage: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  // Many Attendance records belong to One Labour
  @ManyToOne(() => Labour, (labour) => labour.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'labourId' })
  labour: Labour;

  @CreateDateColumn()
  createdAt: Date;
}
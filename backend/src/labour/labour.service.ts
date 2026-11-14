import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labour, LabourStatus, LabourSkill } from './entities/labour.entity';
import { Attendance, AttendanceStatus, ShiftType } from './entities/attendance.entity';
import { CreateLabourDto } from './dto/create-labour.dto';
import { LogAttendanceDto } from './dto/log-attendance.dto';

@Injectable()
export class LabourService {
  constructor(
    @InjectRepository(Labour)
    private labourRepo: Repository<Labour>,

    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  // 1. Onboard a New Labour
  async onboardLabour(dto: CreateLabourDto): Promise<Labour> {
    const labour = this.labourRepo.create({
      ...dto,
      status: dto.status || LabourStatus.ACTIVE,
    });
    return await this.labourRepo.save(labour);
  }

  // 2. Get All Labours (with search & skill filter)
  async getAllLabours(search?: string, skill?: string): Promise<Labour[]> {
    const query = this.labourRepo.createQueryBuilder('labour');

    if (search) {
      query.andWhere(
        '(LOWER(labour.name) LIKE LOWER(:search) OR labour.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (skill && skill !== 'ALL') {
      query.andWhere('labour.skill = :skill', { skill });
    }

    query.orderBy('labour.id', 'DESC');
    return await query.getMany();
  }

  // 3. Get Single Labour Details with Attendance History
  async getLabourById(id: number): Promise<Labour> {
    const labour = await this.labourRepo.findOne({
      where: { id },
      relations: { attendances: true },
    });
    if (!labour) throw new NotFoundException(`Labour with ID ${id} not found`);
    return labour;
  }

  // 4. Update Labour
  async updateLabour(id: number, attrs: Partial<Labour>): Promise<Labour> {
    const labour = await this.getLabourById(id);
    Object.assign(labour, attrs);
    return await this.labourRepo.save(labour);
  }

  // 5. Delete / Deactivate Labour
  async deleteLabour(id: number): Promise<{ message: string }> {
    const labour = await this.getLabourById(id);
    await this.labourRepo.remove(labour);
    return { message: `Labour ${labour.name} deleted successfully` };
  }

  // 6. Log Daily Attendance & Automatically Calculate Wages
  async logAttendance(dto: LogAttendanceDto): Promise<Attendance> {
    const labour = await this.labourRepo.findOne({ where: { id: dto.labourId } });
    if (!labour) throw new NotFoundException(`Labour with ID ${dto.labourId} not found`);

    if (labour.status !== LabourStatus.ACTIVE) {
      throw new BadRequestException('Cannot mark attendance for an INACTIVE labour');
    }

    // AUTOMATED WAGE CALCULATION RULE:
    // PRESENT  -> 100% of Daily Wage
    // HALF_DAY -> 50% of Daily Wage
    // ABSENT   -> 0
    let wage = 0;
    const dailyWage = Number(labour.dailyWage);

    if (dto.status === AttendanceStatus.PRESENT) {
      wage = dailyWage;
    } else if (dto.status === AttendanceStatus.HALF_DAY) {
      wage = dailyWage * 0.5;
    } else if (dto.status === AttendanceStatus.ABSENT) {
      wage = 0;
    }

    // Check if attendance already logged for this date (update instead of duplicate)
    let attendance = await this.attendanceRepo.findOne({
      where: {
        labour: { id: dto.labourId },
        date: dto.date,
      },
    });

    if (attendance) {
      attendance.status = dto.status;
      attendance.shift = dto.shift || ShiftType.DAY;
      attendance.calculatedWage = wage;
      attendance.remarks = dto.remarks || attendance.remarks;
    } else {
      attendance = this.attendanceRepo.create({
        labour,
        date: dto.date,
        status: dto.status,
        shift: dto.shift || ShiftType.DAY,
        calculatedWage: wage,
        remarks: dto.remarks || '',
      });
    }

    return await this.attendanceRepo.save(attendance);
  }

  // 7. Get Attendance Sheet for a Specific Date
  async getDailyAttendanceSheet(date: string) {
    const labours = await this.labourRepo.find({ where: { status: LabourStatus.ACTIVE } });
    const attendances = await this.attendanceRepo.find({
      where: { date },
      relations: { labour: true },
    });

    const attendanceMap = new Map();
    attendances.forEach((att) => {
      if (att.labour) {
        attendanceMap.set(att.labour.id, att);
      }
    });

    return labours.map((labour) => {
      const log = attendanceMap.get(labour.id);
      return {
        labourId: labour.id,
        name: labour.name,
        skill: labour.skill,
        dailyWage: Number(labour.dailyWage),
        date,
        attendanceId: log ? log.id : null,
        status: log ? log.status : 'NOT_MARKED',
        shift: log ? log.shift : 'DAY',
        calculatedWage: log ? Number(log.calculatedWage) : 0,
        remarks: log ? log.remarks : '',
      };
    });
  }

  // 8. Seeder to populate demo labours for instant testing
  async seedDemoLabours() {
    const count = await this.labourRepo.count();
    if (count === 0) {
      await this.labourRepo.save([
        { name: 'Ramesh Kumar', phone: '9876543201', skill: LabourSkill.MASON, dailyWage: 850, status: LabourStatus.ACTIVE },
        { name: 'Suresh Patil', phone: '9876543202', skill: LabourSkill.ELECTRICIAN, dailyWage: 900, status: LabourStatus.ACTIVE },
        { name: 'Vijay Shinde', phone: '9876543203', skill: LabourSkill.CARPENTER, dailyWage: 800, status: LabourStatus.ACTIVE },
        { name: 'Anil Rathod', phone: '9876543204', skill: LabourSkill.HELPER, dailyWage: 550, status: LabourStatus.ACTIVE },
        { name: 'Ganesh Pujari', phone: '9876543205', skill: LabourSkill.WELDER, dailyWage: 950, status: LabourStatus.ACTIVE },
      ]);
      console.log('✅ Demo Labours Seeded in Neon PostgreSQL!');
    }
  }
}
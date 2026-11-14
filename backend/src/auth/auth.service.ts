import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Register a New Supervisor/Admin
  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: 'SUPERVISOR',
    });

    await this.userRepo.save(user);
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Account created successfully',
    };
  }

  // 2. Login User
  async login(dto: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email.toLowerCase() })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Login successful',
    };
  }

  // 3. Seed Default Supervisor Account
  async seedAdmin() {
    const count = await this.userRepo.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userRepo.save({
        name: 'Site Supervisor',
        email: 'supervisor@labour.com',
        password: hashedPassword,
        role: 'SUPERVISOR',
      });
      console.log('👤 Default Supervisor Created: supervisor@labour.com / admin123');
    }
  }
}
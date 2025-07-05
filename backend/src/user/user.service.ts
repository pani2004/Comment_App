import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
  const existing = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existing) {
    throw new ConflictException('User already exists');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    },
  });

  // 👇 Exclude password before returning
  const { password, ...result } = user;
  return result;
 }
}
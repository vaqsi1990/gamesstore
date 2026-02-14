import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Verification } from '../verification.entity';
import { User } from '../user.entity';


@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepo: Repository<Verification>,
  ) {}

  private generateCode(length = 5): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async createTokenForUser(user: User, expiresInMinutes = 10): Promise<string> {
    const token = this.generateCode(5);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    await this.verificationRepo.save(
      this.verificationRepo.create({
        userId: user.id,
        user,
        token,
        expiresAt,
      }),
    );

    return token;
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const now = new Date();

    const record = await this.verificationRepo.findOne({
      where: { userId, token },
    });

    if (!record) return false;
    if (record.expiresAt < now) return false;

    // valid – token შეიძლება აქვე წაშალო:
    await this.verificationRepo.delete(record.id);

    return true;
  }
}
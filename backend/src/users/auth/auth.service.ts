import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { VerificationService } from '../verification/verification.service';
import { generateOPT } from './otp.util';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly verificationService: VerificationService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    // 1) Check if user with this email already exists
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2) create user
    const user = await this.userService.createUser(createUserDto);

    // 3) generate and save 5-letter OTP (store however your app prefers)
    const otp = generateOPT(5);
    // Example: attach to user and save, or store in a separate table with expiry
    user.emailOtp = otp;
    user.emailOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await this.userService.save(user);

    // 4) send OTP email via Resend
    try {
      const apiKey = this.configService.get<string>('RESEND_API_KEY');
      if (!apiKey) {
        throw new Error('RESEND_API_KEY is not set in environment');
      }
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: process.env.RESEND_FROM as string,
        to: user.email,
        subject: 'Your verification code',
        html: `<p>Your verification code is: <b>${otp}</b></p>`,
      });
    } catch (emailError) {
      // Log error but don't fail registration - user can request new code
      console.error('Failed to send email:', emailError);
      // You can optionally throw here if email is critical
      // throw new InternalServerErrorException('Failed to send verification email');
    }

    return user;
  }
    // გააგზავნო კოდი (აქ Email გაგზავნა შენ უნდა დაამატო)
    public async sendEmailVerification(userId: string): Promise<string> {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      const token = await this.verificationService.createTokenForUser(user);
  
      // აქ უნდა ჩასვა შენი email-გაგზავნის ლოგიკა:
      // await this.mailService.sendVerificationEmail(user.email, token);
  
      return token; // dev-ზე შეგიძლია დაუბრუნო, რომ ნახო მუშაობს
    }
    async verifyEmailOtp(email: string, otp: string): Promise<boolean> {
      const user = await this.userService.findOneByEmail(email);
      if (
        !user ||
        user.emailOtp !== otp ||
        !user.emailOtpExpiresAt ||
        user.emailOtpExpiresAt < new Date()
      ) {
        return false;
      }
  
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiresAt = null;
      await this.userService.save(user);
  
      return true;
    }

    async verifyRegistration(email: string, otp: string): Promise<string> {
      const user = await this.userService.findOneByEmail(email);
      if (
        !user ||
        user.emailOtp !== otp ||
        !user.emailOtpExpiresAt ||
        user.emailOtpExpiresAt < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired verification code');
      }
  
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiresAt = null;
      await this.userService.save(user);
  
      return this.generateToken(user);
    }
    public async confirmEmail(userId: string, token: string): Promise<boolean> {
      const isValid = await this.verificationService.verifyToken(userId, token);
      if (!isValid) {
        return false;
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        return false;
      }

      user.isVerified = true;
      await this.userService.save(user); // ან შეაკეთე userService-ში update მეთოდი

      return true;
    }
    

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);

    // 1) Theres no such user
    // 2) Password is invalid
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.passwordService.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, name: user.name, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}


import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import type { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';
import { AdminResponse } from '../admin.response';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../role.enum';
import { VerifyRegistrationDto } from '../verify-registration.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  @Post('verify-registration')
  @Public()
  async verifyRegistration(
    @Body() verifyDto: VerifyRegistrationDto,
  ): Promise<LoginResponse> {
    const accessToken = await this.authService.verifyRegistration(
      verifyDto.email,
      verifyDto.otp,
    );

    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  async adminOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for admins only!' });
  }

  @Get('support')
  @Roles(Role.SUPPORT)
  async supportOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for support only!' });
  }

  @Get('trust-and-safety')
  @Roles(Role.TRUST_AND_SAFETY)
  async trustAndSafetyOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for Trust & Safety only!' });
  }

  @Get('moderator')
  @Roles(Role.MODERATOR)
  async moderatorOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for moderators only!' });
  }

  @Get('system-owner')
  @Roles(Role.SYSTEM_OWNER)
  async systemOwnerOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for system owners only!' });
  }
}

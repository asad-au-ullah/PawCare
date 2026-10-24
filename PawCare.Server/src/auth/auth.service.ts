import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../infrastructure/email/email.service';
import { EmailTemplates } from '../infrastructure/email/email.templates';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly email: EmailService,
  ) { }

  // ─── Register ──────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const emailAddr = dto.email.trim().toLowerCase();
    const existing = await this.db.user.findUnique({ where: { email: emailAddr } });
    if (existing) throw new BadRequestException({ error: 'Email is already registered.' });

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.db.user.create({
      data: {
        email: emailAddr,
        passwordHash,
        role: 'PetOwner',
        isEmailVerified: false,
        petOwner: { create: { firstName: dto.firstName, lastName: dto.lastName } },
      },
    });

    await this.createAndSendVerificationEmail(user.id, emailAddr);

    return { message: 'Check your email to verify your account.' };
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const emailAddr = dto.email.trim().toLowerCase();
    const user = await this.db.user.findUnique({
      where: { email: emailAddr },
      include: { petOwner: true, veterinarian: true },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException({
        message: 'Email address not verified.',
        requiresEmailVerification: true,
      });
    }

    return this.issueToken(user);
  }

  // ─── Verify Email ──────────────────────────────────────────────────────────

  async verifyEmail(dto: VerifyEmailDto) {
    const record = await this.db.emailVerification.findFirst({
      where: { userId: dto.userId, token: dto.token },
      include: { user: { include: { petOwner: true, veterinarian: true } } },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired verification link.');
    }

    if (record.expiresAt < new Date()) {
      // Clean up the expired record and report the error
      await this.db.emailVerification.delete({ where: { id: record.id } });
      throw new BadRequestException('Verification link has expired. Please request a new one.');
    }

    // Mark the user as verified and remove the token in a single transaction
    const [user] = await this.db.$transaction([
      this.db.user.update({
        where: { id: dto.userId },
        data: { isEmailVerified: true },
        include: { petOwner: true, veterinarian: true },
      }),
      this.db.emailVerification.delete({ where: { id: record.id } }),
    ]);

    return this.issueToken(user);
  }

  // ─── Resend Verification ───────────────────────────────────────────────────

  async resendVerification(dto: ResendVerificationDto) {
    const emailAddr = dto.email.trim().toLowerCase();
    const user = await this.db.user.findUnique({ where: { email: emailAddr } });

    // Don't leak whether the email exists — return the same message regardless
    if (!user || user.isEmailVerified) {
      return { message: 'If that email is registered and unverified, a new link has been sent.' };
    }

    // Delete any existing token before issuing a new one
    await this.db.emailVerification.deleteMany({ where: { userId: user.id } });
    await this.createAndSendVerificationEmail(user.id, user.email);

    return { message: 'If that email is registered and unverified, a new link has been sent.' };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async createAndSendVerificationEmail(userId: string, emailAddr: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.db.emailVerification.create({
      data: { userId, token, expiresAt },
    });

    const frontendUrl = this.config.get<string>('FRONTEND_BASE_URL') ?? 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-email?userId=${userId}&token=${token}`;

    try {
      await this.email.send(
        emailAddr,
        'Verify your PawCare email address',
        EmailTemplates.verificationEmail(emailAddr, verificationLink),
      );
    } catch (err) {
      this.logger.error(`Failed to send verification email to ${emailAddr}`, err);
      throw new InternalServerErrorException(
        'Account created but we could not send the verification email. Please use the resend option.',
      );
    }
  }

  private issueToken(user: {
    id: string;
    email: string;
    role: string;
    petOwner: { firstName: string; lastName: string } | null;
    veterinarian: { firstName: string; lastName: string } | null;
  }) {
    const expiresIn = Number(this.config.get<string>('JWT_EXPIRY_MINUTES') ?? 60) * 60;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const person = user.petOwner ?? user.veterinarian;

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      given_name: person?.firstName ?? '',
      family_name: person?.lastName ?? '',
      role: user.role,
      jti: randomUUID(),
    });

    return { token, expiresAt, role: user.role };
  }
}

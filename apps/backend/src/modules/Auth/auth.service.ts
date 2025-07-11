import {
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthEmailDto } from './dtos/authEmail.dto';
import { hash, verify } from 'argon2';
import { RegDto } from './dtos/reg.dto';
import { randomBytes } from 'crypto';
import { CustomMailService } from '../../common/mail/mail.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: CustomMailService,
  ) {}

  async signToken(
    userId: string,
    company_id: string,
    is_admin: boolean,
    company_subs_id?: string | null,
  ): Promise<{ access_token: string, refresh_token: string }> {
    const payload = {
      sub: userId,
      company_id,
      is_admin,
      company_subs_id,
    };

    const secret = this.config.get('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRE'),
      secret: secret,
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRE'),
      secret: secret
    });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        employeeId: userId,
        expiresAt,
      },
    });

    return {
      access_token: access_token,
      refresh_token: refresh_token
    };
  }
  async signUp(dto: RegDto) {
    let companyData: any = {};
    let userData: any = {};

    const check = await this.prisma.employee.findFirst({
        where: {
          OR: [{ email: dto.email }, { phone: dto.phone }],
        },
      });

    if(check){
      return {
        statusCode: 409,
        message: "Email or phone number already in use"
      }
    }

    //Company
    if (dto.name) companyData.name = dto.name;
    // companyData.max_employee = 10;
    // const trial = await this.prisma.subscription.findFirst({
    //   where: { name: 'Trial' },
    // });
    // companyData.subscription_id = trial.id;
    // companyData.subs_date_start = new Date().toISOString();
    // companyData.subs_date_end = new Date(
    //   new Date().setDate(new Date().getDate() + 14),
    // ).toISOString();

    //Employee
    if (dto.first_name) userData.first_name = dto.first_name;
    if (dto.last_name) userData.last_name = dto.last_name;
    if (dto.email) userData.email = dto.email;
    if (dto.phone) userData.phone = dto.phone;
    if (dto.password) userData.password = await hash(dto.password);
    userData.is_admin = true;
    userData.position = "HR";

    try {
      const company = await this.prisma.company.create({
        data: companyData,
      });

      if (company.id) userData.company_id = company.id;

      const user = await this.prisma.employee.create({ data: userData });
      return {
        statusCode: 201,
        message: 'Registration Successful',
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }
  async emailSignIn(dto: AuthEmailDto) {
    try {
      const employee = await this.prisma.employee.findFirst({
        where: {
          OR: [{ email: dto.input }, { phone: dto.input }],
        },
      });

      if (
        employee == null) {
          return {
            statusCode: 404,
            message: 'Employee not found',
          };
        }

      if (employee.is_deleted === true) {
        return {
          statusCode: 403,
          message: 'This account is inactive',
        };
      }

      if(await verify(employee.password, dto.password) == false
      ) {
        return {
          statusCode: 401,
          message: 'Credentials Incorrect',
        };
      } else {
        const company = await this.prisma.company.findFirst({
          where: { id: employee.company_id },
        });
        const token = await this.signToken(
          employee.id,
          employee.company_id,
          employee.is_admin,
          company.subscription_id,
        );

        return token;
      }
    } catch (error) {
      console.log('Error: ', error);
      return {
        statusCode: error.code,
        message: error.message,
      };
    }
  }

  async forgotPassword(email: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { email },
    });

    if (!employee)
      return {
        statusCode: 404,
        message: 'Email not found.',
      };

    const token = randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 1000 * 60 * 15);

    await this.prisma.passwordReset.create({
      data: {
        token,
        employee_id: employee.id,
        expires_at,
      },
    });

    const resetLink = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.mailService.sendResetPassword(employee.email, resetLink);

    return {
      statusCode: 200,
      message: 'Reset link sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!record || record.expires_at < new Date()) {
      throw new ForbiddenException('Token expired or invalid');
    }

    const hashed = await hash(newPassword);
    await this.prisma.employee.update({
      where: { id: record.employee_id },
      data: { password: hashed },
    });

    await this.prisma.passwordReset.delete({ where: { token } });

    return { message: 'Password reset successful' };
  }

  async validateResetToken(token: string): Promise<boolean> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!record || record.expires_at < new Date()) {
      return false;
    }

    return true;
  }

  // src/auth/auth.service.ts
  async googleLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.config.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload) throw new UnauthorizedException('Invalid Google token');

    const { email, given_name, family_name } = payload;

    // Cek apakah user sudah terdaftar
    let employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    // Jika belum, buat user dan company baru
    if (!employee) {
      const trial = await this.prisma.subscription.findFirst({
        where: { name: 'Trial' },
      });

      const company = await this.prisma.company.create({
        data: {
          name: email.split('@')[0],
          // max_employee: 10,
          // subscription_id: trial?.id,
          // subs_date_start: new Date().toISOString(),
          // subs_date_end: new Date(
          //   new Date().setDate(new Date().getDate() + 14),
          // ).toISOString(),
        },
      });

      employee = await this.prisma.employee.create({
        data: {
          email,
          first_name: given_name || '',
          last_name: family_name || '',
          company_id: company.id,
          is_admin: true,
          password: '', // kosong karena login via Google
          position: "HR"
        },
      });
    }

    const company = await this.prisma.company.findFirst({
      where: { id: employee.company_id },
    });

    // Buat JWT
    const token = await this.signToken(
      employee.id,
      employee.company_id,
      employee.is_admin,
      company.subscription_id,
    );
    return token;
  }

  async tokenRefresh(tokenString: string){
    let payload:any;
    try{
      payload = await this.jwt.verifyAsync(tokenString,{
        secret: this.config.get('JWT_SECRET')
      });
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: { employeeId: payload.sub,
          expiresAt: { gt: new Date() },
        },
      });

      const isValid = await Promise.any(
        storedTokens.map(t => verify(t.token, tokenString).catch(() => false))
      );

      if (!isValid) throw new ForbiddenException('Refresh token not recognized');

      const employee = await this.prisma.employee.findFirst({where:{id:payload.sub}});
      const company = await this.prisma.company.findFirst({where:{id: employee.id}});

      const tokens = await this.signToken(
        employee.id,
        employee.company_id,
        employee.is_admin,
        company.subscription_id,
      );

      return tokens;
    }
    catch(e){
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async removeRefreshToken(tokenString: string){
    await this.prisma.refreshToken.deleteMany({
      where:{
        token:tokenString
      }
    });
  }
}

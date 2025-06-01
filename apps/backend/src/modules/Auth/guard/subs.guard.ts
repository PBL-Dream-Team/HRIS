import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const company = await this.prisma.company.findFirst({
      where: { id: user.company_id },
    });

    if (!company) {
      throw new ForbiddenException('Company not found');
    }

    if (company.subs_date_end > new Date()) {
      return true;
    }

    throw new ForbiddenException('Subscription ran out');
  }
}

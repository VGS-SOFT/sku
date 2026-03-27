import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['refresh_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return payload;
  }
}

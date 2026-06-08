import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: { headers: { authorization?: string } },
    payload: { sub: string },
  ) {
    const authHeader = req.headers.authorization ?? '';
    const refreshToken = authHeader.replace(/^Bearer\s+/i, '');

    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      userId: payload.sub,
      email: user.email,
      role: user.role,
      refreshToken,
    };
  }
}

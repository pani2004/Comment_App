import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    console.log('[JWT STRATEGY] Initialized');
    const jwtSecret = config.get<string>('JWT_SECRET');
    console.log('[JWT STRATEGY] secret:', jwtSecret);
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email?: string }) {
    console.log('[JWT STRATEGY] validate called with payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}

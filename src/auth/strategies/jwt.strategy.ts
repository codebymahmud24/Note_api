import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.auth_token || null, // ✅ read from cookies
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret', // ⚠️ set this in .env
    });
  }

  async validate(payload: any) {
    // payload contains what you signed in AuthService
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}

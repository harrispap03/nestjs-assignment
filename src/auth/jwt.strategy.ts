import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
    console.log("JwtStrategy initialized");
  }

  async validate(payload: any) {
    const user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
    return user;
  }
}

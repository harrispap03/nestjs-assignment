import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  private createToken(user) {
    const payload = {
      username: user.fullName, 
      sub: user.id,
      roles: [user.role]
    };
    return this.jwtService.sign(payload);
  }

  async register(userRegisterInfo: CreateUserDto) {
    const foundUser = await this.userService.findUserByEmail(
      userRegisterInfo.email
    );

    if (foundUser) {
      throw new ConflictException("User already exists");
    }

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(userRegisterInfo.password, 10);
    const newUser = await this.userService.createUser({
      ...userRegisterInfo,
      password: hashedPassword,
    });

    const token = this.createToken(newUser); 

    return {
      user: newUser,
      access_token: token,
    };
  }

  async login(userLoginInfo: LoginUserDto) {
    const foundUser = await this.userService.findUserByEmail(userLoginInfo.email);
    // Give a generic error for increased safety
    if (!foundUser) {
      throw new UnauthorizedException("Wrong credentials");
    }

    const passwordIsValid = await bcrypt.compare(
      userLoginInfo.password,
      foundUser.password
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException("Wrong credentials");
    }

    const token = this.createToken(foundUser); 

    return {
      access_token: token,
    };
  }
}

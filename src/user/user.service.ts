import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.fullName = createUserDto.fullName;
		newUser.role = "member"

    return this.userRepository.save(newUser);
  }

  async findUserByEmail(
    email: LoginUserDto["email"]
  ): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}

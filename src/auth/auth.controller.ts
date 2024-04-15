import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService){}

	@Post("/register")
	async register(@Body() userData: CreateUserDto){
		return this.authService.register(userData)
	}

	@Post("/login")
	async login(@Body() userData: LoginUserDto){
		return this.authService.login(userData)
	}
}

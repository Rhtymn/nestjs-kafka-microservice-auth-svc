import {
  LoginRequest,
  RegisterRequest,
  ValidateTokenRequest,
} from '@app/interface';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../service/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(data: RegisterRequest) {
    return this.authService.register(data);
  }

  @MessagePattern('login')
  async login(data: LoginRequest) {
    return this.authService.login(data);
  }

  @MessagePattern('validate-token')
  async validateToken(validateTokenRequest: ValidateTokenRequest) {
    return this.authService.validateToken(validateTokenRequest);
  }
}

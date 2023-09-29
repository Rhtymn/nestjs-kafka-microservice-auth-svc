import { JWT_SERVICE, USER_SERVICE } from '@app/constants';
import {
  DecodedJwtTokenPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '@app/interface';
import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from './jwt.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  @Inject(USER_SERVICE)
  private readonly userService: UserService;

  @Inject(JWT_SERVICE)
  private readonly jwtService: JwtService;

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Check if user exists
      const isUserExists: boolean = await this.userService.isUserExists(
        data.email,
      );

      if (isUserExists) {
        return {
          status: HttpStatus.CONFLICT,
          error: ['User already exists'],
        };
      }

      // If not, create user
      data.password = await this.jwtService.hashPassword(data.password);
      await this.userService.createUser(data);

      return {
        status: HttpStatus.CREATED,
        error: [],
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ['Internal server error'],
      };
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // Check is user exists
      const isUserExists: boolean = await this.userService.isUserExists(
        data.email,
      );

      if (!isUserExists) {
        return {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: ['Invalid credentials'],
          token: null,
        };
      }

      // If exists, check password
      const user: User = await this.userService.getUserByEmail(data.email);
      const isPasswordMatch: boolean = await this.jwtService.comparePassword(
        data.password,
        user.password,
      );

      if (!isPasswordMatch) {
        return {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: ['Invalid credentials'],
          token: null,
        };
      }

      // If password match, generate token
      const token: string = await this.jwtService.generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      return {
        status: HttpStatus.OK,
        error: [],
        token,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ['Internal server error'],
        token: null,
      };
    }
  }

  async validateToken(
    validateTokenRequest: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    try {
      // Validate token
      const isValid: boolean = await this.jwtService.isValidToken(
        validateTokenRequest.token,
      );

      if (!isValid) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: ['Invalid token'],
          payload: null,
        };
      }

      const payload: DecodedJwtTokenPayload = await this.jwtService.decodeToken(
        validateTokenRequest.token,
      );
      delete payload.iat;
      delete payload.exp;
      return {
        status: HttpStatus.OK,
        error: [],
        payload,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ['Internal server error'],
        payload: null,
      };
    }
  }
}

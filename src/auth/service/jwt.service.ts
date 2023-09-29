import { DecodedJwtTokenPayload, JwtTokenPayload } from '@app/interface';
import { Injectable } from '@nestjs/common';
import { JwtService as jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: jwt) {}

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async generateToken(payload: JwtTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  public async isValidToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async decodeToken(token: string): Promise<DecodedJwtTokenPayload> {
    return this.jwtService.decode(token) as DecodedJwtTokenPayload;
  }
}

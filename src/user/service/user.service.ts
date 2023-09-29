import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { RegisterRequest } from '@app/interface';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async createUser(user: RegisterRequest): Promise<User> {
    const newUser = new User();
    newUser.email = user.email;
    newUser.username = user.username;
    newUser.password = user.password;

    return await this.userRepository.save(newUser);
  }

  async isUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      return true;
    }

    return false;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
}

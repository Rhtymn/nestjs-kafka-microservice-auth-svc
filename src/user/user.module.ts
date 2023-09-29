import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { USER_SERVICE } from '@app/constants';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: USER_SERVICE, useClass: UserService }],
  exports: [{ provide: USER_SERVICE, useClass: UserService }],
})
export class UserModule {}

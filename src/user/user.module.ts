import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HelloModule } from '../hello/hello.module';

@Module({
  imports: [HelloModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

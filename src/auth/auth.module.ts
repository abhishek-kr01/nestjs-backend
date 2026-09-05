import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles-guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
      // this will make the post repository available for injection
      // available in the current scope
      TypeOrmModule.forFeature([User]),

      // Passport module
      PassportModule,

      // configure JWT
      JwtModule.register({})
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard]
})
export class AuthModule {}

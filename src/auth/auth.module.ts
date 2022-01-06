import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{name: User.name ,schema: userSchema}]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '1d' }
      }),
  })
],
})
export class AuthModule {}

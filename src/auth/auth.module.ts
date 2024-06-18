import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TeachersModule } from 'src/teachers/teachers.module';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { CommonModule } from 'src/common/common.module';
import { Student } from 'src/students/student/entities/student.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Teacher]),
    TypeOrmModule.forFeature([Student]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

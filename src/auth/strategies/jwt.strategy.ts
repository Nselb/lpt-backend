import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Student } from '../entities';
import { JwtStudentPayload } from '../dto/intrefaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async vaidateStudent(payload: JwtStudentPayload): Promise<Student> {
    const { id } = payload;
    const user = await this.studentRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }
    return user;
  }
}

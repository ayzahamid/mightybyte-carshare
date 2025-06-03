import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIVERS } from '../common/driver-store';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateDriver(credentials: LoginDto) {
    return DRIVERS.find(d => d.username === credentials.username && d.password === credentials.password) || null;
  }

  createToken(driver: { id: string, username: string }) {
    return this.jwtService.sign({ id: driver.id, username: driver.username });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}

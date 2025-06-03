import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { driverLocations } from '../common/driver-store';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LocationDto } from './dto/location.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly authService: AuthService) {}

  @Post('update')
  updateLocation(
    @Req() req: Request,
    @Body() body: { lat: number; long: number },
  ) {
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing or invalid token');
    let username: string;
    try {
      const payload = this.authService.verifyToken(auth.slice(7));
      username = payload.username;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    if (typeof body.lat !== 'number' || typeof body.long !== 'number')
      throw new UnauthorizedException('Invalid coordinates');
    driverLocations.set(username, {
      lat: body.lat,
      long: body.long,
      timestamp: Date.now(),
    });
    return { status: 'ok' };
  }
}

import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() body: LoginDto) {
    const driver = this.authService.validateDriver(body);
    if (!driver) throw new UnauthorizedException('Invalid credentials');
    const token = this.authService.createToken(driver);
    return {
      token,
      driver: { id: driver.id, name: driver.name, image: driver.image }
    };
  }
}

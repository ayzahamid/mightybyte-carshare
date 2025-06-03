// config/jwt.config.ts
import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('jwt.secret'),
  signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
});

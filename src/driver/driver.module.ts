import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DriverGateway } from './driver.gateway';

@Module({
  imports: [AuthModule],
  controllers: [DriverController],
  providers: [DriverService, DriverGateway],
})
export class DriverModule {}

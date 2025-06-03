import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { driverLocations } from '../common/driver-store';

@WebSocketGateway({ namespace: '/driver', cors: { origin: '*' } })
export class DriverGateway {
  // socket.id -> { username, expiresAt }
  private driverSessions = new Map<string, { username: string, expiresAt: number }>();

  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('auth_driver')
  handleAuth(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token: string }
  ) {
    console.log('auth_driver event received');
    try {
      const payload = this.authService.verifyToken(data.token);
      this.driverSessions.set(client.id, {
        username: payload.username,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      });
      client.emit('auth_ok');
    } catch {
      client.emit('error', { error: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  @SubscribeMessage('location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number, long: number }
  ) {
    console.log('location_update event received');
    const session = this.driverSessions.get(client.id);
    if (!session) {
      client.emit('error', { error: 'Not authenticated' });
      client.disconnect();
      return;
    }
    if (Date.now() > session.expiresAt) {
      client.emit('error', { error: 'Token expired' });
      client.disconnect();
      return;
    }
    if (typeof data.lat === 'number' && typeof data.long === 'number') {
      console.log(`Driver ${session.username} updated location:`, data);
      driverLocations.set(session.username, {
        lat: data.lat,
        long: data.long,
        timestamp: Date.now(),
      });
    }
  }

  handleDisconnect(client: Socket) {
    this.driverSessions.delete(client.id);
  }
}

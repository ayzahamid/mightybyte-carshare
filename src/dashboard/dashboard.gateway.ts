import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DRIVERS, driverLocations } from '../common/driver-store';

@WebSocketGateway({ namespace: '/dashboard', cors: { origin: '*' } })
export class DashboardGateway {
  // client.id -> { username, interval, offlineInterval }
  private subscriptions = new Map<
    string,
    {
      username: string;
      interval: NodeJS.Timeout;
      offlineInterval: NodeJS.Timeout;
    }
  >();

  @SubscribeMessage('subscribe_driver')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string },
  ) {
    this.clearIntervals(client.id);
    const username = data.username;
    console.log('Subscribing to driver:', username);
    // Send latest location every 5s if recent
    const interval = setInterval(() => {
      const location = driverLocations.get(username);
      const driver = DRIVERS.find((d) => d.username === username);

      if (
        location &&
        driver &&
        Date.now() - location.timestamp <= 60 * 1000 // less than 1 min
      ) {
        client.emit('location', {
          username: driver.username,
          name: driver.name,
          image: driver.image,
          lat: location.lat,
          long: location.long,
          timestamp: new Date(location.timestamp).toISOString(),
        });
      }
      // else do nothing; the offlineInterval below will handle the offline error
    }, 5000);

    // Send offline error every 60s if no fresh location
    const offlineInterval = setInterval(() => {
      const location = driverLocations.get(username);
      const driver = DRIVERS.find((d) => d.username === username);
      if (
        driver &&
        (!location || Date.now() - location.timestamp > 60 * 1000)
      ) {
        client.emit('error', {
          errorCode: 'OFFLINE_DRIVER',
          errorMessage: 'Driver has been offline for a while now',
          lastUpdate: location
            ? new Date(location.timestamp).toISOString()
            : null,
        });
      }
    }, 60000);

    this.subscriptions.set(client.id, { username, interval, offlineInterval });
    client.emit('subscribed', { username });
  }

  @SubscribeMessage('switch_driver')
  handleSwitch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string },
  ) {
    this.handleSubscribe(client, data);
    client.emit('switched', { username: data.username });
  }

  handleDisconnect(client: Socket) {
    this.clearIntervals(client.id);
  }

  private clearIntervals(clientId: string) {
    const sub = this.subscriptions.get(clientId);
    if (sub) {
      clearInterval(sub.interval);
      clearInterval(sub.offlineInterval);
      this.subscriptions.delete(clientId);
    }
  }
}

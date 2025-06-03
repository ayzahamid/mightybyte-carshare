import { Driver, DriverLocation } from './types';

// --- In-memory storage for drivers and locations ---
export const DRIVERS: Driver[] = [
  { id: '0c0df84c-a3e6-4b55-9b00-7a660f571d99', email: 'driver1@dummy.com' ,username: 'driver1', password: 'pass1', name: 'Josh', image: 'https://i.pravatar.cc/100?img=1' },
  { id: '6e937d9f-3777-421e-b78f-304dc935969c', email: 'driver2@dummy.com' ,username: 'driver2', password: 'pass2', name: 'Sara', image: 'https://i.pravatar.cc/100?img=2' },
  { id: 'e97ae663-d8d4-429f-abcf-8d8a647f0aef', email: 'driver3@dummy.com' ,username: 'driver3', password: 'pass3', name: 'Mike', image: 'https://i.pravatar.cc/100?img=3' },
];

export const driverLocations: Map<string, DriverLocation> = new Map();

/**
 * In a real app, DRIVERS and driverLocations would be database queries (e.g., via TypeORM or Prisma).
 * Example:
 * - DRIVERS: `await driverRepository.find()`
 * - driverLocations: would be replaced with a distributed cache (e.g., Redis), or a DB table with upserts and a timestamp.
 */

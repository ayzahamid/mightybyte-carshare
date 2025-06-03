export interface Driver {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  image: string;
}
export interface DriverLocation {
  lat: number;
  long: number;
  timestamp: number;
}

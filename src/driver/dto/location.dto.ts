// login.dto.ts
import { IsString, MinLength } from 'class-validator';

export class LocationDto {
  @IsString()
  lat: string;

  @IsString()
  long: string;
}

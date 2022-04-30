import { datetime } from 'Types';

export type FlightSlice = {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: datetime;
  arrival_date_time_utc: datetime;
  flight_number: string;
  duration: number;
};

export type Flight = {
  slices: FlightSlice[];
  price: number;
};

export type FlightSourceResponse = {
  flights: Flight[];
};

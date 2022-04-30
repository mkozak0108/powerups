import { Flight } from 'Types';

export function getFlightKey(flight: Flight) {
  return flight.slices.reduce((key, slice) => {
    return `${key};${slice.flight_number}:${slice.departure_date_time_utc}:${slice.arrival_date_time_utc}`;
  }, '');
}

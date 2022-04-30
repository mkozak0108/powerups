import { faker } from '@faker-js/faker';
import { Flight } from 'Types';

export function getFlight(): Flight {
  return {
    price: faker.datatype.number(),
    slices: [
      {
        origin_name: faker.name.firstName(),
        destination_name: faker.name.firstName(),
        departure_date_time_utc: faker.date.soon().toISOString(),
        arrival_date_time_utc: faker.date.future().toISOString(),
        flight_number: faker.datatype.number().toString(),
        duration: faker.datatype.number(),
      },
    ],
  };
}

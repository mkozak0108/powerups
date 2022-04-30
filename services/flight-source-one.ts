import axios from 'axios';
import { FLIGHT_SOURCE_URL } from 'Consts';
import { FlightSourceResponse } from 'Types';
import { FlightSource } from 'Services';

export class FlightSourceOneService implements FlightSource {
  async getAll() {
    return (
      await axios.get<FlightSourceResponse>(
        `${FLIGHT_SOURCE_URL}/flight/source1`
      )
    ).data;
  }
}

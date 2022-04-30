import axios from 'axios';
import { FLIGHT_SOURCE_URL } from 'Consts';
import { FlightSourceResponse } from 'Types';
import { FlightSource } from 'Services';

export class FlightSourceTwoService implements FlightSource {
  async getAll() {
    return (
      await axios.get<FlightSourceResponse>(
        `${FLIGHT_SOURCE_URL}/flight/source2`
      )
    ).data;
  }
}

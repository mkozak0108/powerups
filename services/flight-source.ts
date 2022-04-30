import { FlightSourceResponse } from 'Types';

export abstract class FlightSource {
  async getAll(): Promise<FlightSourceResponse> {
    throw new Error('Not implemented');
  }
}

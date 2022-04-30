import { FlightSourceResponse, milliseconds } from 'Types';
import { FlightSource } from 'Services';
import NodeCache from 'node-cache';
import { getFlightKey, wait } from 'Helpers';
import { ONE_HOUR } from 'Consts';

export class FlightService {
  sources: FlightSource[] = [];
  cache = new NodeCache();
  timeout: milliseconds = 0;

  constructor(sources: FlightSource[], timeout: milliseconds = 0) {
    this.sources = sources;
    this.timeout = timeout;
  }

  async getAll(): Promise<FlightSourceResponse> {
    const promiseRequests = this.cacheServiceResponses();

    if (this.cache.keys().length) {
      // wait requests or timeout
      await Promise.race([wait(this.timeout), promiseRequests]);
    } else {
      await promiseRequests;
    }

    return {
      flights: Object.values(this.cache.mget(this.cache.keys())),
    };
  }

  cacheServiceResponses() {
    return Promise.allSettled(
      this.sources.map((source) => source.getAll())
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.status === 'fulfilled') {
          this.putToCache(response.value);
        } else {
          // TODO: store logs somewhere
          console.warn(response.reason);
        }
      });
    });
  }

  private putToCache(response: FlightSourceResponse) {
    response.flights.forEach((flight) => {
      this.cache.set(getFlightKey(flight), flight, ONE_HOUR);
    });
  }
}

import { FlightService, FlightSource } from 'Services';
import { Flight } from 'Types';
import { getFlight } from '../mocks';
import { wait } from 'Helpers';

describe('FlightService', () => {
  const timeout = 50;
  let sources: FlightSource[];

  beforeEach(() => {
    const sameFlight: Flight = getFlight();

    const source1 = {
      getAll: jest.fn().mockResolvedValue({
        flights: [getFlight(), getFlight(), sameFlight],
      }),
    };

    const source2 = {
      getAll: jest.fn().mockResolvedValue({
        flights: [sameFlight, getFlight()],
      }),
    };

    sources = [source1, source2];
  });

  describe('constructor', () => {
    it('should assign sources and timeout', () => {
      const flightService = new FlightService(sources, timeout);
      expect(flightService.sources).toEqual(sources);
      expect(flightService.timeout).toEqual(timeout);
    });
  });

  describe('getAll', () => {
    it('should call all sources getAll method', async () => {
      const flightService = new FlightService(sources, timeout);
      await flightService.getAll();
      expect(sources[0].getAll).toHaveBeenCalled();
      expect(sources[1].getAll).toHaveBeenCalled();
    });

    it('should put unique flights to cache', async () => {
      const flightService = new FlightService(sources, timeout);
      await flightService.getAll();
      expect(flightService.cache.keys().length).toEqual(4);
    });

    it('should return empty array if all services failed', async () => {
      sources[0].getAll = jest.fn().mockRejectedValue(null);
      sources[1].getAll = jest.fn().mockRejectedValue(null);

      const flightService = new FlightService(sources, timeout);
      const { flights } = await flightService.getAll();
      expect(flights).toEqual([]);
      expect(flightService.cache.keys().length).toEqual(0);
    });

    it('should skip error if one of services failed and return value of another', async () => {
      sources[0].getAll = jest.fn().mockRejectedValue(null);

      const flightService = new FlightService(sources, timeout);
      const resp = await flightService.getAll();
      expect(resp).toEqual(await sources[1].getAll());
      expect(flightService.cache.keys().length).toEqual(2);
    });

    it('should wait for responses if there are no values in the cache ', async () => {
      const waitingTime = 200;
      sources[0].getAll = jest.fn().mockReturnValue(
        wait(waitingTime).then(() => ({
          flights: [],
        }))
      );
      sources[1].getAll = jest.fn().mockReturnValue(
        wait(waitingTime).then(() => ({
          flights: [],
        }))
      );

      const flightService = new FlightService(sources, timeout);
      const start = Date.now();
      await flightService.getAll();
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(waitingTime);
    });

    it('should not wait for responses if there are values in the cache ', async () => {
      const flightService = new FlightService(sources, timeout);
      await flightService.getAll();

      const waitingTime = 200;
      sources[0].getAll = jest.fn().mockReturnValue(
        wait(waitingTime).then(() => ({
          flights: [],
        }))
      );
      sources[1].getAll = jest.fn().mockReturnValue(
        wait(waitingTime).then(() => ({
          flights: [],
        }))
      );

      const start = Date.now();
      await flightService.getAll();
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(timeout);
      expect(end - start).toBeLessThan(waitingTime);
    });
  });
});

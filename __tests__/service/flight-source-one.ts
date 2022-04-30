import { FlightSourceOneService } from 'Services';
import axios from 'axios';
import { FLIGHT_SOURCE_URL } from 'Consts';

describe('FlightSourceOneService', () => {
  const data = {};

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: data });
  });

  describe('getAll', () => {
    it('should call axios and return data', async () => {
      const flightOneSource = new FlightSourceOneService();

      expect(await flightOneSource.getAll()).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith(
        `${FLIGHT_SOURCE_URL}/flight/source1`
      );
    });
  });
});

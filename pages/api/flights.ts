import type { NextApiRequest, NextApiResponse } from 'next';
import { FlightSourceResponse } from 'Types';
import {
  FlightService,
  FlightSourceOneService,
  FlightSourceTwoService,
} from 'Services';
import { ONE_SECOND } from 'Consts';

const flightService = new FlightService(
  [new FlightSourceOneService(), new FlightSourceTwoService()],
  ONE_SECOND
);

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse<FlightSourceResponse>
) {
  try {
    const flights = await flightService.getAll();
    res.status(200).json(flights);
  } catch (ex) {
    console.error(ex);
    res.status(500);
  }
}

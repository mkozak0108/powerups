import { wait } from 'Helpers';

describe('wait', () => {
  it('should return promise which resolves in N milliseconds', async () => {
    const timeout = 300;
    const start = Date.now();
    await wait(timeout);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(timeout);
  });
});

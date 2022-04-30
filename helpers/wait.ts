import { milliseconds } from 'Types';

export function wait(timeout: milliseconds): Promise<void> {
  return new Promise((res) => setTimeout(res, timeout));
}

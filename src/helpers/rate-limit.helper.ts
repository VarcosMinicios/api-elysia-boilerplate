import { AuthError } from '@errors/auth.error';
import { redis } from '@database/redis';

const INCR_EXPIRE = `
local n = redis.call('INCR', KEYS[1])
if n == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[1]))
end
return n
`;

export async function consumeRateLimit(
  server: { requestIP: (request: Request) => { address: string } | null | undefined } | null,
  request: Request,
  action: string,
  max: number,
  windowSeconds = 900
) {
  const ip = server?.requestIP(request)?.address ?? 'unknown';

  try {
    const count = Number(await redis.send('EVAL', [INCR_EXPIRE, '1', `rl:${action}:${ip}`, String(windowSeconds)]));
    if (count > max) throw new AuthError('Too many requests', 429);
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Service unavailable', 503);
  }
}

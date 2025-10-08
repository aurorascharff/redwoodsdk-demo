import { PrismaClient } from '@generated/prisma';
import { PrismaD1 } from '@prisma/adapter-d1';
import { requestInfo } from 'rwsdk/worker';
export type * from '@generated/prisma';

export type { PrismaClient };

export const getDb = () => requestInfo.ctx.db;

/**
 * Creates a "slow" proxy wrapper around a Prisma D1 adapter to simulate
 * long-running queries for testing race conditions.
 * @param adapter The real PrismaD1 adapter instance.
 * @param delayMs The delay to introduce in milliseconds.
 */
function createSlowAdapter(adapter: PrismaD1, delayMs = 500) {
  return new Proxy(adapter, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod === 'function') {
        // Intercept all function calls to the adapter
        return async function (...args: any[]) {
          console.log(`--- RWSDK DEBUG: Delaying DB adapter method "${String(prop)}" by ${delayMs}ms ---`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return originalMethod.apply(target, args);
        };
      }

      return originalMethod;
    },
  });
}

// context(justinvdm, 21-05-2025): We need to instantiate the client via a
// function rather that at the module level for several reasons:
// * For prisma-client-js generator or cases where there are dynamic import to
//   the prisma wasm modules, we need to make sure we are instantiating the
//   prisma client later in the flow when the wasm would have been initialized
// * So that we can encapsulate workarounds, e.g. see `SELECT 1` workaround
//   below
export const setupDb = async (env: Env) => {
  const originalAdapter = new PrismaD1(env.DB);
  const slowAdapter = createSlowAdapter(originalAdapter);

  const client = new PrismaClient({
    // context(justinvdm, 21-05-2025): prisma-client generated type appears to
    // consider D1 adapter incompatible, though in runtime (dev and production)
    // it works
    // @ts-ignore
    adapter: slowAdapter,
  });

  // context(justinvdm, 21-05-2025): https://github.com/cloudflare/workers-sdk/pull/8283
  await client.$queryRaw`SELECT 1`;

  // Set the client in the current request context
  requestInfo.ctx.db = client;
};

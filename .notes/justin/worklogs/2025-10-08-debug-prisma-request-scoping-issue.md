# Work Log: 2025-10-08 - Debugging Prisma Request Scoping in Cloudflare Workers

## 1. Problem Definition & Goal

The initial problem was a critical failure in the demo application where the Cloudflare Worker would hang indefinitely. This was accompanied by a Miniflare warning in the console: "A promise was resolved or rejected from a different request context than the one it was created in."

The primary hypothesis was that a single, module-level `PrismaClient` instance was being shared across multiple concurrent requests. In a serverless environment like Cloudflare Workers, this is an anti-pattern that can lead to state leakage and race conditions, as I/O objects (like a database connection) are not supposed to be shared between different request contexts.

The goal was to refactor the database access pattern to ensure that each incoming request uses its own isolated `PrismaClient` instance, thereby preventing any cross-request state contamination and resolving the worker hanging issue.

## 2. Investigation

The issue was reminiscent of a problem solved previously in the SDK's internal `rwsdk/db` (Durable Object-based) implementation, which had used a request-scoped pattern. A review of the `rwsdk/db` git history (specifically commit `0e85b4a6`) confirmed that its request-scoped caching mechanism (`RwContext.databases`) had been intentionally removed to address issues with queue handlers. The new implementation created a fresh `Kysely` instance on every call to `createDb`.

This historical context validated the hypothesis. It showed that request-scoping was a known and necessary pattern for database clients in the SDK, and that the demo app's current Prisma implementation (a module-level singleton) was the likely cause of the problem.

## 3. Attempt #1: Proxy-Based Request-Scoped State (`defineRequestState`)

The first solution was to create a generic, SDK-level utility to manage request-scoped state for any object, not just database clients.

-   **Implementation:** A new `defineRequestState` function was added to the SDK (`rwsdk/requestState`). This function leveraged the SDK's existing `requestInfo` mechanism, which is built on `AsyncLocalStorage`. It returned a `Proxy` object. Any interaction with the proxy would be delegated to an object instance stored on `requestInfo.__userContext` (a new property added for this purpose), ensuring that the correct instance was used for the active request. The demo app's `db.ts` was refactored to use this new utility, and `sessionMiddleware` was updated to create and set a new `PrismaClient` instance for each request.

-   **Challenges & Refinements:**
    -   **`crypto.randomUUID` in global scope:** The initial implementation used `crypto.randomUUID()` to generate unique keys for state variables. This caused a deployment error in Cloudflare Workers ("Asynchronous IO... not allowed within global scope"). This was fixed by replacing it with a simple module-level `stateCounter`.
    -   **"Sticky State" Heisenbug:** Despite seeming to work locally, the issue persisted intermittently for another team member. The proxy-based abstraction was suspected of hiding a subtle "sticky state" bug, where state was not being properly isolated between requests under certain hard-to-reproduce conditions. This made further debugging difficult.

## 4. Attempt #2: Direct Context Attachment and Stress Testing

Due to the persistent, hard-to-reproduce nature of the bug with the proxy-based solution, the decision was made to switch to a more explicit and transparent pattern.

-   **Implementation:** The `defineRequestState` API was deprecated and removed from the demo app. The `PrismaClient` instance is now attached directly to `requestInfo.ctx.db` within the `sessionMiddleware` at the start of each request. A simple `getDb()` function (`export const getDb = () => requestInfo.ctx.db;`) was created to provide access to the request-scoped client. All parts of the demo application were refactored to import and use `getDb()` instead of the module-level `db` object.

-   **Validation via Stress Testing:** To validate this new approach and attempt to reproduce the original issue, an aggressive stress test was added.
    -   An API endpoint (`/api/stress-test`) was created that performs a simple database query and includes artificial `setTimeout` delays to increase the duration and overlap of concurrent requests.
    -   A client component (`StressTest.tsx`) was added to the main application layout. It uses a `setInterval` loop to fire 5 new concurrent `fetch` requests to the API endpoint every 100ms, creating a high-concurrency environment where dozens of requests can be in-flight simultaneously.

## 5. Current Status

The current implementation with direct context attachment (`getDb()`) appears stable and correct according to best practices for state management in serverless workers.

However, the situation remains unresolved:

-   Despite extensive local testing—running the aggressive stress test while simultaneously making code changes to trigger HMR (following the steps in `STEPS.md`)—the original worker hanging and cross-request promise resolution issue **cannot be reproduced**.
-   The issue reportedly persists intermittently for another team member. This strongly suggests the root cause might be environmental (e.g., a caching issue, different Node/pnpm versions, OS-specific behavior) rather than a flaw in the current code logic.

The path forward is unclear. The inability to reproduce the issue locally is a significant blocker to further investigation.

## 6. Attempt #3: Re-evaluating with New Stack Trace

Another look at the stack trace has provided a critical clue, shifting the investigation's focus.

**Error Log:**
```
7:30:08 AM [vite] Internal server error: The Workers runtime canceled this request because it detected that your Worker's code had hung and would never generate a response. Refer to: https://developers.cloudflare.com/workers/observability/errors/
      at async ProxyServer.fetch (file:///Users/aurorascharff/Documents/Development/redwoodsdk-v1/node_modules/.pnpm/miniflare@4.20250924.0/node_modules/miniflare/src/workers/core/proxy.worker.ts:174:11)
Warning: A promise was resolved or rejected from a different request context than the one it was created in. However, the creating request has already been completed or canceled. Continuations for that request are unlikely to run safely and have been canceled. If this behavior breaks your worker, consider setting the no_handle_cross_request_promise_resolution compatibility flag for your worker.
    at Object.resolve (<anonymous>)
    at /Users/aurorascharff/Documents/Development/redwoodsdk-v1/node_modules/.vite/deps_worker/@prisma_client_runtime_wasm.js:4152:54

Failed to fetch RSC update: Internal Server Error
```

**Analysis and Refined Hypothesis:**

The stack trace consistently points to a specific line within `@prisma/client/runtime/wasm.js`, inside a function named `dispatchBatches`. This is a strong indicator that the root cause is not simply the shared `PrismaClient` instance itself, but rather Prisma's internal **query batching mechanism**.

The new hypothesis is as follows:
1.  Prisma's query engine automatically batches multiple queries that are made within the same tick of the Node.js event loop into a single database roundtrip for performance.
2.  In a high-concurrency serverless environment, it's possible for queries from two completely separate incoming HTTP requests (Request A and Request B) to land in the same event loop tick.
3.  Prisma's batcher may combine these queries. It creates promises for each original query.
4.  The batch is executed.
5.  By the time the database responds and `dispatchBatches` attempts to resolve the promise for Request A, its original request context may have already been torn down by the Cloudflare Workers runtime.
6.  If Request B's context is still active, the resolution of Request A's promise happens within Request B's context, triggering the "cross-request promise resolution" error and causing the worker to hang.

This explains why the previous fix of request-scoping the `PrismaClient` made the issue less frequent but did not eliminate it. The core issue lies in the interaction between Prisma's `nextTick`-based batching and the strict request context separation of the Workers runtime.

**Next Steps:**

The current stress test (many short, fast queries) may not be sufficient to reliably trigger this batching behavior. The next step is to devise a new test that creates longer, more complex database transactions to increase the likelihood of queries from different requests overlapping within Prisma's batching window.

## 7. Attempt #4: Combined Middleware and Client-Side Stress Test

The transaction-based approach was blocked by Cloudflare D1's limitation on interactive transactions. Even after refactoring to a sequential create/wait/delete flow, the issue could not be reproduced. The hypothesis shifted again: perhaps the stress test was too isolated from the rest of the application's lifecycle. An API endpoint that only performs database operations might not create the same complex interactions as a full page render cycle. The subsequent attempt to move the logic into a middleware was a step in the right direction, but it lacked a mechanism to guarantee high-frequency execution.

The new strategy combines both approaches for maximum pressure: a database-intensive middleware that is constantly triggered by a client-side component.

-   **Implementation:**
    1.  **Database Middleware:** A middleware remains in `src/worker.tsx` that runs on every request. It executes a sequential, long-running database operation: `todo.create()`, `await setTimeout(100)`, and `todo.delete()`.
    2.  **No-Op Server Function:** A new, empty `async` server function, `noOp`, was created. Its sole purpose is to provide a target for the client to call, triggering the full server middleware pipeline.
    3.  **Client-Side Trigger:** A new `<StressTest />` component was created and placed in the main `AppLayout`. This component uses a `setInterval` to call the `noOp` server function every 50ms, ensuring a constant, high-frequency stream of requests to the server.

-   **Current Status:** The stress test is now a two-part system. A client-side component acts as a high-frequency trigger, ensuring the server is always busy. On every one of those requests, the middleware creates significant database contention. This represents the most realistic and aggressive attempt to reproduce the race condition so far.

## 8. Attempt #5: Fire-and-Forget Database Operations

Previous attempts focused on creating contention by making requests long-running. The new hypothesis is that the issue might be triggered by the opposite scenario: a request that finishes *too quickly*, leaving database operations to complete after the request context has been torn down.

This attempt will test this by intentionally creating "orphaned" promises. The stress test middleware will trigger database operations but will *not* `await` their completion. This allows the request to proceed and potentially finish before the database work is done.

-   **Implementation:**
    1.  The `stressTestMiddleware` in `src/worker.tsx` will be modified.
    2.  The `db.todo.create()` and `db.todo.delete()` calls will be wrapped in an immediately-invoked `async` function without awaiting the function itself. This will cause the database operations to run in the background, detached from the request lifecycle.

-   **Expected Outcome:** This should reliably trigger the "cross-request promise resolution" warning. If it does, it will confirm that the core issue is related to promise resolution timing and not necessarily just database contention. If it *doesn't* trigger the error, it would be a very surprising result, suggesting something more complex is at play.

## 9. Attempt #6: Bulk Operations to Stress the Query Engine

The fire-and-forget strategy with single `create`/`delete` operations failed to reproduce the error. The console logging revealed that these operations were completing almost instantaneously, likely not creating enough sustained load to trigger a race condition in Prisma's batching scheduler.

The new hypothesis is that a much heavier, longer-running database operation is required to keep the query engine busy long enough for the context-switching issue to occur.

-   **Implementation:**
    1.  The `stressTestMiddleware` will be modified to perform bulk database operations.
    2.  Inside the non-awaited, "fire-and-forget" async function, it will now use `db.todo.createMany` to insert a payload of 100 new todo records.
    3.  This is immediately followed by a `db.todo.deleteMany` call to clean up the newly created records, ensuring the database state remains clean.

-   **Expected Outcome:** This significantly heavier workload should increase the time Prisma's query engine spends processing a single request's operations. This sustained load makes it much more likely that the promises for these bulk operations will resolve after the original request context has been torn down, finally providing a reliable reproduction of the error.

### 6a. Sub-Attempt: Working around D1 `LIKE` Limitation

The initial bulk-operation attempt failed with a `D1_ERROR: LIKE or GLOB pattern too complex`. This was caused by the `deleteMany` call using a `startsWith` filter, which Prisma translates into a `LIKE` query that D1's SQLite engine cannot handle.

-   **Refined Implementation:** To work around this, the `deleteMany` operation was changed. Instead of using `startsWith`, it now uses a `where: { title: { in: [...] } }` clause. The array of exact titles is generated in memory first, used for the `createMany` call, and then re-used for the `deleteMany` call. This generates a simpler `DELETE ... WHERE title IN (...)` query that D1 can process.

## 10. Attempt #7: `Promise.all` for High-Concurrency Load

The bulk operation approach, while avoiding the D1 `LIKE` limitation, introduced a new problem: excessive `prisma:warn` noise in the console because D1 de-sugars `createMany`/`deleteMany` into individual queries. More importantly, it still failed to reproduce the bug.

The new strategy is to create a similar high-concurrency load, but without using the specific Prisma methods that generate warnings.

-   **Implementation:**
    1.  The `stressTestMiddleware` will be modified again.
    2.  Instead of a single `createMany` call, it will now create an array of 100 individual `db.todo.create()` promises.
    3.  It will then use `await Promise.all()` to execute all 100 create operations concurrently.
    4.  After creation, it will gather the IDs of the new todos and use another `Promise.all` with `db.todo.delete()` to clean them up concurrently.

-   **Expected Outcome:** This approach still generates a massive, parallelized load on the database to stress the query batching engine. However, by using standard single-operation methods, it should avoid the D1 transaction warnings, giving us a cleaner environment to observe the actual bug if it occurs. This is a more direct simulation of many concurrent users interacting with the database at once.

### 7a. Sub-Attempt: Maximizing Request Turnover

As a final tweak to the `Promise.all` strategy, the 50ms artificial delay was removed from the `noOp` server function. The goal is to make the request handler itself complete as quickly as possible, creating the largest possible time window between the request context being torn down and the background "fire-and-forget" database promises resolving.

## 8. Breakthrough: Reproducing the HMR Race Condition

**Success.** The issue has been reliably reproduced.

-   **Reproduction Steps:**
    1.  Start the dev server (`pnpm dev`).
    2.  Load the application in the browser. The stress test begins automatically.
    3.  Open `src/app/shared/functions.ts` and save it repeatedly (e.g., by adding and removing a space).
    4.  Within a few saves, the `TypeError: Cannot set properties of undefined (setting '__requestState_0')` error appears in the Vite server logs, followed by the "cross-request promise resolution" warning.

-   **Root Cause Analysis:**
    The reproduction method confirms that the root cause is a race condition between Vite's Hot Module Replacement (HMR) and in-flight requests. The `defineRequestState` proxy, while functional for isolated requests, is not resilient to HMR.

    1.  When a file like `db.ts` or any of its dependencies is saved, Vite re-executes the module.
    2.  This re-execution calls `defineRequestState()` again, creating a *new* proxy object and a *new* `setDb` function with a different internal key (e.g., `__requestState_1`, then `__requestState_2`).
    3.  If a request from the stress test is in-flight when HMR occurs, it holds a reference to the *old* `setDb` function.
    4.  The HMR process can tear down the `AsyncLocalStorage` context associated with that in-flight request.
    5.  When the original request finally calls its old `setDb` function, `requestInfo.__userContext` is `undefined`, causing the `TypeError`.

-   **Next Steps: Reverting the Revert**
    The proxy abstraction has proven to be the source of the HMR-related instability. The proposed solution is to abandon it and revert to the more direct and robust pattern of attaching the database client directly to the request context. This involves:
    1.  Removing the `defineRequestState` API from the SDK.
    2.  Modifying `setupDb` to set `requestInfo.ctx.db = client`.
    3.  Creating a `getDb()` function to access `requestInfo.ctx.db`.
    4.  Refactoring the demo application to use `getDb()` instead of the proxy.

    This approach decouples the database instance from the module's lifecycle, making it resilient to HMR. The user will now manually test this refactor.

## 9. Attempt #9: Isolating HMR as the Trigger

The "revert the revert" strategy (moving back to a direct `requestInfo.ctx.db` attachment) did not fully resolve the issue. The "cross-request promise resolution" warning still appears intermittently during HMR, though less frequently.

**A New Clue:** The stack trace for the error has changed. It no longer points to Prisma's internal query batching mechanism. Instead, it now originates from our own SDK's `runWithRequestInfo` function.

```
Warning: A promise was resolved or rejected from a different request context...
    at Object.resolve (<anonymous>)
    at runWithRequestInfoFn (/Users/justin/rw/blotter/redwoodsdk-demo/node_modules/.vite/deps_worker/chunk-IUYTT4XY.js:60:25)
    at runWithRequestInfo (...)
    at Object.fetch (...)
```

**Revised Hypothesis:** The problem is not specific to Prisma, but is a more fundamental race condition between the Cloudflare Workers runtime's handling of HMR and Node.js's `AsyncLocalStorage`. During an HMR update, it seems possible for the context of an in-flight request to be lost or incorrectly swapped, causing promises created within that request's scope to resolve outside of it. The high-concurrency stress test was merely an amplifier for this underlying HMR instability.

**Next Steps:** To test this, the stress test will be removed completely. The goal is to see if HMR, triggered by manually saving files during normal application use, is sufficient to cause the `runWithRequestInfo` error on its own. This will isolate HMR as the sole variable.

## 10. Reinstating the Stress Test

The attempt to reproduce the issue with HMR alone proved difficult. It's now clear that both factors are required:

1.  **High Concurrency:** A constant stream of requests, as provided by the stress test.
2.  **State Instability:** The context-switching chaos introduced by HMR.

The stress test has been reinstated to its previous state (a client-side component calling a `noOp` server function, triggering a fire-and-forget database middleware) to provide a reliable environment for debugging the HMR interaction.

## 11. Final Breakthrough: Identifying the Orphaned Promise

A direct code inspection revealed the likely source of the "stale promise": a `deferred` promise pattern within the SDK's core `runWithRequestInfo` function.

-   **Discovery:** The `requestInfo` implementation uses a module-level deferred promise (`requestInfoDeferred`) that is resolved whenever a new request context is run. The hypothesis is that during HMR, the entire module is reloaded, but in-flight requests may still hold references to promises from the *previous* module incarnation. When these orphaned promises are eventually resolved or garbage-collected by the runtime, it happens outside their original context, triggering the error.

-   **Validation:** Manually commenting out `requestInfoDeferred.resolve()` in `node_modules` immediately stopped the "cross-request promise resolution" error. However, this introduced a new, predictable race condition (`Cannot set properties of undefined (setting DB)`), as other parts of the code rely on this deferred promise to ensure the request context is available before they execute. This experiment confirms that the deferred promise is the root cause.

-   **Path Forward:** Two solutions are possible:
    1.  **Pragmatic Fix (Path A):** Remove the `requestInfoDeferred` pattern entirely from the SDK. This is a direct fix for the identified problem but may require careful management of the new race condition it introduces. It doesn't solve the broader class of issues related to background tasks.
    2.  **Robust Fix (Path B):** Implement a system to track background promises and pass them to `ctx.waitUntil()`. This is the idiomatic Cloudflare Workers solution for managing tasks that might outlive the response. It would involve creating a mechanism to register promises against the current request context and ensuring they are passed to `waitUntil()` before the handler finishes. This would solve not only this specific issue but also make the entire framework more resilient to HMR and background processing.

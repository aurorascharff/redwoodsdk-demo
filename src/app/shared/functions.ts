'use server';

export async function noOp() {
  // Add a small delay to keep the request context open longer.
  await new Promise(resolve => setTimeout(resolve, 50));
  // This is an intentional no-op server function.
  // It's called by the stress test component to trigger the middleware pipeline.
  return;
}

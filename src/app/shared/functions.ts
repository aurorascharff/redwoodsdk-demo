'use server';

export async function noOp() {
  // This is an intentional no-op server function.
  // It's called by the stress test component to trigger the middleware pipeline.
  return;
}

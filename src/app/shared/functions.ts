'use server';

export async function noOp() {
  23;
  // This is an intentional no-op server function.
  // It's called by the stress test component to trigger the middleware pipeline.
  return;
}

export async function sigh() {}

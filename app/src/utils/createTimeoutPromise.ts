/**
 * Create a promise that rejects after a given timeout
 * @param timeout - The timeout in milliseconds
 * @returns A promise that rejects after the given timeout
 */
export function createTimeoutPromise(timeout: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeout);
  });
}

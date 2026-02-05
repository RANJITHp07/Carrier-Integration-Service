export function assertNever<T>(value: T): never {
  throw new Error(`Unhandled case: ${value}`);
}

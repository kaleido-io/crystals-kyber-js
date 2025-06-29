// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion_error.js";
import { format } from "../../internal/1.0.8/format.js";

/**
 * Make an assertion that `actual` and `expected` are not strictly equal, using
 * {@linkcode Object.is} for equality comparison. If the values are strictly
 * equal then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotStrictEquals } from "@std/assert";
 *
 * assertNotStrictEquals(1, 1); // Throws
 * assertNotStrictEquals(1, 2); // Doesn't throw
 *
 * assertNotStrictEquals(0, 0); // Throws
 * assertNotStrictEquals(0, -0); // Doesn't throw
 * ```
 *
 * @typeParam T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function assertNotStrictEquals<T>(
  actual: T,
  expected: T,
  msg?: string,
) {
  if (!Object.is(actual, expected)) {
    return;
  }

  const msgSuffix = msg ? `: ${msg}` : ".";
  throw new AssertionError(
    `Expected "actual" to not be strictly equal to: ${
      format(actual)
    }${msgSuffix}\n`,
  );
}

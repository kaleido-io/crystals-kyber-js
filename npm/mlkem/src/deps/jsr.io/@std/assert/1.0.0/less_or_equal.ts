// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { format } from "../../internal/1.0.8/format.js";
import { AssertionError } from "./assertion_error.js";

/**
 * Make an assertion that `actual` is less than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertLessOrEqual } from "@std/assert";
 *
 * assertLessOrEqual(1, 2); // Doesn't throw
 * assertLessOrEqual(1, 1); // Doesn't throw
 * assertLessOrEqual(1, 0); // Throws
 * ```
 *
 * @typeParam T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
export function assertLessOrEqual<T>(
  actual: T,
  expected: T,
  msg?: string,
) {
  if (actual <= expected) return;

  const actualString = format(actual);
  const expectedString = format(expected);
  throw new AssertionError(
    msg ?? `Expect ${actualString} <= ${expectedString}`,
  );
}

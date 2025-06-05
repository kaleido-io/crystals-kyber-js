// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./equal.js", "./assertion_error.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertNotEquals = assertNotEquals;
    const equal_js_1 = require("./equal.js");
    const assertion_error_js_1 = require("./assertion_error.js");
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     *
     * Type parameter can be specified to ensure values under comparison have the same type.
     *
     * @example Usage
     * ```ts no-eval
     * import { assertNotEquals } from "@std/assert";
     *
     * assertNotEquals(1, 2); // Doesn't throw
     * assertNotEquals(1, 1); // Throws
     * ```
     *
     * @typeParam T The type of the values to compare.
     * @param actual The actual value to compare.
     * @param expected The expected value to compare.
     * @param msg The optional message to display if the assertion fails.
     */
    function assertNotEquals(actual, expected, msg) {
        if (!(0, equal_js_1.equal)(actual, expected)) {
            return;
        }
        const actualString = String(actual);
        const expectedString = String(expected);
        const msgSuffix = msg ? `: ${msg}` : ".";
        throw new assertion_error_js_1.AssertionError(`Expected actual: ${actualString} not to be: ${expectedString}${msgSuffix}`);
    }
});

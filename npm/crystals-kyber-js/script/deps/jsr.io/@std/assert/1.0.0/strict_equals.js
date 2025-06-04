(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../internal/1.0.8/mod.js", "./assertion_error.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertStrictEquals = assertStrictEquals;
    // Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
    // This module is browser compatible.
    const mod_js_1 = require("../../internal/1.0.8/mod.js");
    const assertion_error_js_1 = require("./assertion_error.js");
    /**
     * Make an assertion that `actual` and `expected` are strictly equal, using
     * {@linkcode Object.is} for equality comparison. If not, then throw.
     *
     * @example Usage
     * ```ts no-eval
     * import { assertStrictEquals } from "@std/assert";
     *
     * const a = {};
     * const b = a;
     * assertStrictEquals(a, b); // Doesn't throw
     *
     * const c = {};
     * const d = {};
     * assertStrictEquals(c, d); // Throws
     * ```
     *
     * @typeParam T The type of the expected value.
     * @param actual The actual value to compare.
     * @param expected The expected value to compare.
     * @param msg The optional message to display if the assertion fails.
     */
    function assertStrictEquals(actual, expected, msg) {
        if (Object.is(actual, expected)) {
            return;
        }
        const msgSuffix = msg ? `: ${msg}` : ".";
        let message;
        const actualString = (0, mod_js_1.format)(actual);
        const expectedString = (0, mod_js_1.format)(expected);
        if (actualString === expectedString) {
            const withOffset = actualString
                .split("\n")
                .map((l) => `    ${l}`)
                .join("\n");
            message =
                `Values have the same structure but are not reference-equal${msgSuffix}\n\n${(0, mod_js_1.red)(withOffset)}\n`;
        }
        else {
            const stringDiff = (typeof actual === "string") &&
                (typeof expected === "string");
            const diffResult = stringDiff
                ? (0, mod_js_1.diffStr)(actual, expected)
                : (0, mod_js_1.diff)(actualString.split("\n"), expectedString.split("\n"));
            const diffMsg = (0, mod_js_1.buildMessage)(diffResult, { stringDiff }).join("\n");
            message = `Values are not strictly equal${msgSuffix}\n${diffMsg}`;
        }
        throw new assertion_error_js_1.AssertionError(message);
    }
});

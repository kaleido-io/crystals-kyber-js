(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./equal.js", "../../internal/1.0.8/mod.js", "./assertion_error.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertEquals = assertEquals;
    // Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
    // This module is browser compatible.
    const equal_js_1 = require("./equal.js");
    const mod_js_1 = require("../../internal/1.0.8/mod.js");
    const assertion_error_js_1 = require("./assertion_error.js");
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     *
     * Type parameter can be specified to ensure values under comparison have the
     * same type.
     *
     * @example Usage
     * ```ts no-eval
     * import { assertEquals } from "@std/assert";
     *
     * assertEquals("world", "world"); // Doesn't throw
     * assertEquals("hello", "world"); // Throws
     * ```
     *
     * @typeParam T The type of the values to compare. This is usually inferred.
     * @param actual The actual value to compare.
     * @param expected The expected value to compare.
     * @param msg The optional message to display if the assertion fails.
     */
    function assertEquals(actual, expected, msg) {
        if ((0, equal_js_1.equal)(actual, expected)) {
            return;
        }
        const msgSuffix = msg ? `: ${msg}` : ".";
        let message = `Values are not equal${msgSuffix}`;
        const actualString = (0, mod_js_1.format)(actual);
        const expectedString = (0, mod_js_1.format)(expected);
        const stringDiff = (typeof actual === "string") &&
            (typeof expected === "string");
        const diffResult = stringDiff
            ? (0, mod_js_1.diffStr)(actual, expected)
            : (0, mod_js_1.diff)(actualString.split("\n"), expectedString.split("\n"));
        const diffMsg = (0, mod_js_1.buildMessage)(diffResult, { stringDiff }).join("\n");
        message = `${message}\n${diffMsg}`;
        throw new assertion_error_js_1.AssertionError(message);
    }
});

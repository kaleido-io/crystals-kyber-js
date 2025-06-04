(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./assertion_error.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertStringIncludes = assertStringIncludes;
    // Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
    // This module is browser compatible.
    const assertion_error_js_1 = require("./assertion_error.js");
    /**
     * Make an assertion that actual includes expected. If not
     * then throw.
     *
     * @example Usage
     * ```ts no-eval
     * import { assertStringIncludes } from "@std/assert";
     *
     * assertStringIncludes("Hello", "ello"); // Doesn't throw
     * assertStringIncludes("Hello", "world"); // Throws
     * ```
     *
     * @param actual The actual string to check for inclusion.
     * @param expected The expected string to check for inclusion.
     * @param msg The optional message to display if the assertion fails.
     */
    function assertStringIncludes(actual, expected, msg) {
        if (actual.includes(expected))
            return;
        const msgSuffix = msg ? `: ${msg}` : ".";
        msg = `Expected actual: "${actual}" to contain: "${expected}"${msgSuffix}`;
        throw new assertion_error_js_1.AssertionError(msg);
    }
});

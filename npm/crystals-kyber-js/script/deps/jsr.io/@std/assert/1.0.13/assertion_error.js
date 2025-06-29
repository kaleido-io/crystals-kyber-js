// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssertionError = void 0;
    /**
     * Error thrown when an assertion fails.
     *
     * @example Usage
     * ```ts ignore
     * import { AssertionError } from "@std/assert";
     *
     * try {
     *   throw new AssertionError("foo", { cause: "bar" });
     * } catch (error) {
     *   if (error instanceof AssertionError) {
     *     error.message === "foo"; // true
     *     error.cause === "bar"; // true
     *   }
     * }
     * ```
     */
    class AssertionError extends Error {
        /** Constructs a new instance.
         *
         * @param message The error message.
         * @param options Additional options. This argument is still unstable. It may change in the future release.
         */
        constructor(message, options) {
            super(message, options);
            this.name = "AssertionError";
        }
    }
    exports.AssertionError = AssertionError;
});

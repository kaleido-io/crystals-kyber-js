// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./almost_equals.js", "./array_includes.js", "./equals.js", "./exists.js", "./false.js", "./greater_or_equal.js", "./greater.js", "./instance_of.js", "./is_error.js", "./less_or_equal.js", "./less.js", "./match.js", "./not_equals.js", "./not_instance_of.js", "./not_match.js", "./not_strict_equals.js", "./object_match.js", "./rejects.js", "./strict_equals.js", "./string_includes.js", "./throws.js", "./assert.js", "./assertion_error.js", "./equal.js", "./fail.js", "./unimplemented.js", "./unreachable.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** A library of assertion functions.
     * If the assertion is false an `AssertionError` will be thrown which will
     * result in pretty-printed diff of failing assertion.
     *
     * This module is browser compatible, but do not rely on good formatting of
     * values for AssertionError messages in browsers.
     *
     * ```ts no-eval
     * import { assert } from "@std/assert";
     *
     * assert("I am truthy"); // Doesn't throw
     * assert(false); // Throws `AssertionError`
     * ```
     *
     * @module
     */
    __exportStar(require("./almost_equals.js"), exports);
    __exportStar(require("./array_includes.js"), exports);
    __exportStar(require("./equals.js"), exports);
    __exportStar(require("./exists.js"), exports);
    __exportStar(require("./false.js"), exports);
    __exportStar(require("./greater_or_equal.js"), exports);
    __exportStar(require("./greater.js"), exports);
    __exportStar(require("./instance_of.js"), exports);
    __exportStar(require("./is_error.js"), exports);
    __exportStar(require("./less_or_equal.js"), exports);
    __exportStar(require("./less.js"), exports);
    __exportStar(require("./match.js"), exports);
    __exportStar(require("./not_equals.js"), exports);
    __exportStar(require("./not_instance_of.js"), exports);
    __exportStar(require("./not_match.js"), exports);
    __exportStar(require("./not_strict_equals.js"), exports);
    __exportStar(require("./object_match.js"), exports);
    __exportStar(require("./rejects.js"), exports);
    __exportStar(require("./strict_equals.js"), exports);
    __exportStar(require("./string_includes.js"), exports);
    __exportStar(require("./throws.js"), exports);
    __exportStar(require("./assert.js"), exports);
    __exportStar(require("./assertion_error.js"), exports);
    __exportStar(require("./equal.js"), exports);
    __exportStar(require("./fail.js"), exports);
    __exportStar(require("./unimplemented.js"), exports);
    __exportStar(require("./unreachable.js"), exports);
});

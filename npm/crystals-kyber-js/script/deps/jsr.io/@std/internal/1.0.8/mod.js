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
        define(["require", "exports", "./assertion_state.js", "./build_message.js", "./diff.js", "./diff_str.js", "./format.js", "./styles.js", "./types.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Copyright 2018-2025 the Deno authors. MIT license.
    // This module is browser compatible.
    /**
     * Internal utilities for the public API of the Deno Standard Library.
     *
     * Note: this module is for internal use only and should not be used directly.
     *
     * ```ts
     * import { diff, diffStr, buildMessage } from "@std/internal";
     * import { assertEquals } from "@std/assert";
     *
     * const a = [1, 2, 3];
     * const b = [1, 2, 4];
     *
     * assertEquals(diff(a, b), [
     *   { type: "common", value: 1 },
     *   { type: "common", value: 2 },
     *   { type: "removed", value: 3 },
     *   { type: "added", value: 4 },
     * ]);
     *
     * const diffResult = diffStr("Hello, world!", "Hello, world");
     *
     * console.log(buildMessage(diffResult));
     * // [
     * //   "",
     * //   "",
     * //   "    [Diff] Actual / Expected",
     * //   "",
     * //   "",
     * //   "-   Hello, world!",
     * //   "+   Hello, world",
     * //   "",
     * // ]
     * ```
     *
     * @module
     */
    __exportStar(require("./assertion_state.js"), exports);
    __exportStar(require("./build_message.js"), exports);
    __exportStar(require("./diff.js"), exports);
    __exportStar(require("./diff_str.js"), exports);
    __exportStar(require("./format.js"), exports);
    __exportStar(require("./styles.js"), exports);
    __exportStar(require("./types.js"), exports);
});

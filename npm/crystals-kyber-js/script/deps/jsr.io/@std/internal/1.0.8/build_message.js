// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./styles.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createColor = createColor;
    exports.createSign = createSign;
    exports.buildMessage = buildMessage;
    const styles_js_1 = require("./styles.js");
    /**
     * Colors the output of assertion diffs.
     *
     * @param diffType Difference type, either added or removed.
     * @param background If true, colors the background instead of the text.
     *
     * @returns A function that colors the input string.
     *
     * @example Usage
     * ```ts
     * import { createColor } from "@std/internal";
     * import { assertEquals } from "@std/assert";
     * import { bold, green, red, white } from "@std/fmt/colors";
     *
     * assertEquals(createColor("added")("foo"), green(bold("foo")));
     * assertEquals(createColor("removed")("foo"), red(bold("foo")));
     * assertEquals(createColor("common")("foo"), white("foo"));
     * ```
     */
    function createColor(diffType, 
    /**
     * TODO(@littledivy): Remove this when we can detect true color terminals. See
     * https://github.com/denoland/std/issues/2575.
     */
    background = false) {
        switch (diffType) {
            case "added":
                return (s) => background ? (0, styles_js_1.bgGreen)((0, styles_js_1.white)(s)) : (0, styles_js_1.green)((0, styles_js_1.bold)(s));
            case "removed":
                return (s) => background ? (0, styles_js_1.bgRed)((0, styles_js_1.white)(s)) : (0, styles_js_1.red)((0, styles_js_1.bold)(s));
            default:
                return styles_js_1.white;
        }
    }
    /**
     * Prefixes `+` or `-` in diff output.
     *
     * @param diffType Difference type, either added or removed
     *
     * @returns A string representing the sign.
     *
     * @example Usage
     * ```ts
     * import { createSign } from "@std/internal";
     * import { assertEquals } from "@std/assert";
     *
     * assertEquals(createSign("added"), "+   ");
     * assertEquals(createSign("removed"), "-   ");
     * assertEquals(createSign("common"), "    ");
     * ```
     */
    function createSign(diffType) {
        switch (diffType) {
            case "added":
                return "+   ";
            case "removed":
                return "-   ";
            default:
                return "    ";
        }
    }
    /**
     * Builds a message based on the provided diff result.
     *
     * @param diffResult The diff result array.
     * @param options Optional parameters for customizing the message.
     *
     * @returns An array of strings representing the built message.
     *
     * @example Usage
     * ```ts no-assert
     * import { diffStr, buildMessage } from "@std/internal";
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
     */
    function buildMessage(diffResult, options = {}) {
        const { stringDiff = false } = options;
        const messages = [
            "",
            "",
            `    ${(0, styles_js_1.gray)((0, styles_js_1.bold)("[Diff]"))} ${(0, styles_js_1.red)((0, styles_js_1.bold)("Actual"))} / ${(0, styles_js_1.green)((0, styles_js_1.bold)("Expected"))}`,
            "",
            "",
        ];
        const diffMessages = diffResult.map((result) => {
            const color = createColor(result.type);
            const line = result.details?.map((detail) => detail.type !== "common"
                ? createColor(detail.type, true)(detail.value)
                : detail.value).join("") ?? result.value;
            return color(`${createSign(result.type)}${line}`);
        });
        messages.push(...(stringDiff ? [diffMessages.join("")] : diffMessages), "");
        return messages;
    }
});

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
    exports.createCommon = createCommon;
    exports.assertFp = assertFp;
    exports.backTrace = backTrace;
    exports.createFp = createFp;
    exports.diff = diff;
    const REMOVED = 1;
    const COMMON = 2;
    const ADDED = 3;
    /**
     * Creates an array of common elements between two arrays.
     *
     * @typeParam T The type of elements in the arrays.
     *
     * @param A The first array.
     * @param B The second array.
     *
     * @returns An array containing the common elements between the two arrays.
     *
     * @example Usage
     * ```ts
     * import { createCommon } from "@std/internal/diff";
     * import { assertEquals } from "@std/assert";
     *
     * const a = [1, 2, 3];
     * const b = [1, 2, 4];
     *
     * assertEquals(createCommon(a, b), [1, 2]);
     * ```
     */
    function createCommon(A, B) {
        const common = [];
        if (A.length === 0 || B.length === 0)
            return [];
        for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
            const a = A[i];
            const b = B[i];
            if (a !== undefined && a === b) {
                common.push(a);
            }
            else {
                return common;
            }
        }
        return common;
    }
    /**
     * Asserts that the value is a {@linkcode FarthestPoint}.
     * If not, an error is thrown.
     *
     * @param value The value to check.
     *
     * @returns A void value that returns once the assertion completes.
     *
     * @example Usage
     * ```ts
     * import { assertFp } from "@std/internal/diff";
     * import { assertThrows } from "@std/assert";
     *
     * assertFp({ y: 0, id: 0 });
     * assertThrows(() => assertFp({ id: 0 }));
     * assertThrows(() => assertFp({ y: 0 }));
     * assertThrows(() => assertFp(undefined));
     * ```
     */
    function assertFp(value) {
        if (value == null ||
            typeof value !== "object" ||
            typeof value?.y !== "number" ||
            typeof value?.id !== "number") {
            throw new Error(`Unexpected value, expected 'FarthestPoint': received ${typeof value}`);
        }
    }
    /**
     * Creates an array of backtraced differences.
     *
     * @typeParam T The type of elements in the arrays.
     *
     * @param A The first array.
     * @param B The second array.
     * @param current The current {@linkcode FarthestPoint}.
     * @param swapped Boolean indicating if the arrays are swapped.
     * @param routes The routes array.
     * @param diffTypesPtrOffset The offset of the diff types in the routes array.
     *
     * @returns An array of backtraced differences.
     *
     * @example Usage
     * ```ts
     * import { backTrace } from "@std/internal/diff";
     * import { assertEquals } from "@std/assert";
     *
     * assertEquals(
     *   backTrace([], [], { y: 0, id: 0 }, false, new Uint32Array(0), 0),
     *   [],
     * );
     * ```
     */
    function backTrace(A, B, current, swapped, routes, diffTypesPtrOffset) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
            if (!j && !type)
                break;
            const prev = j;
            if (type === REMOVED) {
                result.unshift({
                    type: swapped ? "removed" : "added",
                    value: B[b],
                });
                b -= 1;
            }
            else if (type === ADDED) {
                result.unshift({
                    type: swapped ? "added" : "removed",
                    value: A[a],
                });
                a -= 1;
            }
            else {
                result.unshift({ type: "common", value: A[a] });
                a -= 1;
                b -= 1;
            }
            j = routes[prev];
            type = routes[prev + diffTypesPtrOffset];
        }
        return result;
    }
    /**
     * Creates a {@linkcode FarthestPoint}.
     *
     * @param k The current index.
     * @param M The length of the first array.
     * @param routes The routes array.
     * @param diffTypesPtrOffset The offset of the diff types in the routes array.
     * @param ptr The current pointer.
     * @param slide The slide {@linkcode FarthestPoint}.
     * @param down The down {@linkcode FarthestPoint}.
     *
     * @returns A {@linkcode FarthestPoint}.
     *
     * @example Usage
     * ```ts
     * import { createFp } from "@std/internal/diff";
     * import { assertEquals } from "@std/assert";
     *
     * assertEquals(
     *   createFp(
     *     0,
     *     0,
     *     new Uint32Array(0),
     *     0,
     *     0,
     *     { y: -1, id: 0 },
     *     { y: 0, id: 0 },
     *   ),
     *   { y: -1, id: 1 },
     * );
     * ```
     */
    function createFp(k, M, routes, diffTypesPtrOffset, ptr, slide, down) {
        if (slide && slide.y === -1 && down && down.y === -1) {
            return { y: 0, id: 0 };
        }
        const isAdding = (down?.y === -1) ||
            k === M ||
            (slide?.y ?? 0) > (down?.y ?? 0) + 1;
        if (slide && isAdding) {
            const prev = slide.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = ADDED;
            return { y: slide.y, id: ptr };
        }
        if (down && !isAdding) {
            const prev = down.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = REMOVED;
            return { y: down.y + 1, id: ptr };
        }
        throw new Error("Unexpected missing FarthestPoint");
    }
    /**
     * Renders the differences between the actual and expected values.
     *
     * @typeParam T The type of elements in the arrays.
     *
     * @param A Actual value
     * @param B Expected value
     *
     * @returns An array of differences between the actual and expected values.
     *
     * @example Usage
     * ```ts
     * import { diff } from "@std/internal/diff";
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
     * ```
     */
    function diff(A, B) {
        const prefixCommon = createCommon(A, B);
        A = A.slice(prefixCommon.length);
        B = B.slice(prefixCommon.length);
        const swapped = B.length > A.length;
        [A, B] = swapped ? [B, A] : [A, B];
        const M = A.length;
        const N = B.length;
        if (!M && !N && !prefixCommon.length)
            return [];
        if (!N) {
            return [
                ...prefixCommon.map((value) => ({ type: "common", value })),
                ...A.map((value) => ({ type: swapped ? "added" : "removed", value })),
            ];
        }
        const offset = N;
        const delta = M - N;
        const length = M + N + 1;
        const fp = Array.from({ length }, () => ({ y: -1, id: -1 }));
        /**
         * Note: this buffer is used to save memory and improve performance. The first
         * half is used to save route and the last half is used to save diff type.
         */
        const routes = new Uint32Array((M * N + length + 1) * 2);
        const diffTypesPtrOffset = routes.length / 2;
        let ptr = 0;
        function snake(k, A, B, slide, down) {
            const M = A.length;
            const N = B.length;
            const fp = createFp(k, M, routes, diffTypesPtrOffset, ptr, slide, down);
            ptr = fp.id;
            while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
                const prev = fp.id;
                ptr++;
                fp.id = ptr;
                fp.y += 1;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = COMMON;
            }
            return fp;
        }
        let currentFp = fp[delta + offset];
        assertFp(currentFp);
        let p = -1;
        while (currentFp.y < N) {
            p = p + 1;
            for (let k = -p; k < delta; ++k) {
                const index = k + offset;
                fp[index] = snake(k, A, B, fp[index - 1], fp[index + 1]);
            }
            for (let k = delta + p; k > delta; --k) {
                const index = k + offset;
                fp[index] = snake(k, A, B, fp[index - 1], fp[index + 1]);
            }
            const index = delta + offset;
            fp[delta + offset] = snake(delta, A, B, fp[index - 1], fp[index + 1]);
            currentFp = fp[delta + offset];
            assertFp(currentFp);
        }
        return [
            ...prefixCommon.map((value) => ({ type: "common", value })),
            ...backTrace(A, B, currentFp, swapped, routes, diffTypesPtrOffset),
        ];
    }
});

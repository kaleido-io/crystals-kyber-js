// Copyright 2018-2025 the Deno authors. MIT license.
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../../../_dnt.test_shims.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _AssertionState_instances, _AssertionState_state, _AssertionState_ensureCleanedUp;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssertionState = void 0;
    exports.getAssertionState = getAssertionState;
    /**
     * Check the test suite internal state
     *
     * @example Usage
     * ```ts ignore
     * import { AssertionState } from "@std/internal";
     *
     * const assertionState = new AssertionState();
     * ```
     */
    const dntShim = __importStar(require("../../../../../_dnt.test_shims.js"));
    class AssertionState {
        constructor() {
            _AssertionState_instances.add(this);
            _AssertionState_state.set(this, void 0);
            __classPrivateFieldSet(this, _AssertionState_state, {
                assertionCount: undefined,
                assertionCheck: false,
                assertionTriggered: false,
                assertionTriggeredCount: 0,
            }, "f");
            if (typeof globalThis?.addEventListener === "function") {
                globalThis.addEventListener("unload", () => {
                    __classPrivateFieldGet(this, _AssertionState_instances, "m", _AssertionState_ensureCleanedUp).call(this);
                });
            }
            else if (
            // deno-lint-ignore no-explicit-any
            typeof dntShim.dntGlobalThis?.process?.on === "function") {
                // deno-lint-ignore no-explicit-any
                dntShim.dntGlobalThis.process.on("exit", () => {
                    __classPrivateFieldGet(this, _AssertionState_instances, "m", _AssertionState_ensureCleanedUp).call(this);
                });
            }
            else {
                // deno-lint-ignore no-console
                console.warn("AssertionCounter cleanup step was not registered");
            }
        }
        /**
         * Get the number that through `expect.assertions` api set.
         *
         * @returns the number that through `expect.assertions` api set.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.assertionCount;
         * ```
         */
        get assertionCount() {
            return __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount;
        }
        /**
         * Get a certain number that assertions were called before.
         *
         * @returns return a certain number that assertions were called before.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.assertionTriggeredCount;
         * ```
         */
        get assertionTriggeredCount() {
            return __classPrivateFieldGet(this, _AssertionState_state, "f").assertionTriggeredCount;
        }
        /**
         * If `expect.hasAssertions` called, then through this method to update #state.assertionCheck value.
         *
         * @param val Set #state.assertionCheck's value
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.setAssertionCheck(true);
         * ```
         */
        setAssertionCheck(val) {
            __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCheck = val;
        }
        /**
         * If any matchers was called, `#state.assertionTriggered` will be set through this method.
         *
         * @param val Set #state.assertionTriggered's value
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.setAssertionTriggered(true);
         * ```
         */
        setAssertionTriggered(val) {
            __classPrivateFieldGet(this, _AssertionState_state, "f").assertionTriggered = val;
        }
        /**
         * If `expect.assertions` called, then through this method to update #state.assertionCheck value.
         *
         * @param num Set #state.assertionCount's value, for example if the value is set 2, that means
         * you must have two assertion matchers call in your test suite.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.setAssertionCount(2);
         * ```
         */
        setAssertionCount(num) {
            __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount = num;
        }
        /**
         * If any matchers was called, `#state.assertionTriggeredCount` value will plus one internally.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.updateAssertionTriggerCount();
         * ```
         */
        updateAssertionTriggerCount() {
            if (__classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount !== undefined) {
                __classPrivateFieldGet(this, _AssertionState_state, "f").assertionTriggeredCount += 1;
            }
        }
        /**
         * Check Assertion internal state, if `#state.assertionCheck` is set true, but
         * `#state.assertionTriggered` is still false, then should throw an Assertion Error.
         *
         * @returns a boolean value, that the test suite is satisfied with the check. If not,
         * it should throw an AssertionError.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * if (assertionState.checkAssertionErrorState()) {
         *   // throw AssertionError("");
         * }
         * ```
         */
        checkAssertionErrorState() {
            return __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCheck && !__classPrivateFieldGet(this, _AssertionState_state, "f").assertionTriggered;
        }
        /**
         * Reset all assertion state when every test suite function ran completely.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * assertionState.resetAssertionState();
         * ```
         */
        resetAssertionState() {
            __classPrivateFieldSet(this, _AssertionState_state, {
                assertionCount: undefined,
                assertionCheck: false,
                assertionTriggered: false,
                assertionTriggeredCount: 0,
            }, "f");
        }
        /**
         * Check Assertion called state, if `#state.assertionCount` is set to a number value, but
         * `#state.assertionTriggeredCount` is less then it, then should throw an assertion error.
         *
         * @returns a boolean value, that the test suite is satisfied with the check. If not,
         * it should throw an AssertionError.
         *
         * @example Usage
         * ```ts ignore
         * import { AssertionState } from "@std/internal";
         *
         * const assertionState = new AssertionState();
         * if (assertionState.checkAssertionCountSatisfied()) {
         *   // throw AssertionError("");
         * }
         * ```
         */
        checkAssertionCountSatisfied() {
            return __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount !== undefined &&
                __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount !== __classPrivateFieldGet(this, _AssertionState_state, "f").assertionTriggeredCount;
        }
    }
    exports.AssertionState = AssertionState;
    _AssertionState_state = new WeakMap(), _AssertionState_instances = new WeakSet(), _AssertionState_ensureCleanedUp = function _AssertionState_ensureCleanedUp() {
        // If any checks were registered, after the test suite runs the checks,
        // `resetAssertionState` should also have been called. If it was not,
        // then the test suite did not run the checks.
        if (__classPrivateFieldGet(this, _AssertionState_state, "f").assertionCheck ||
            __classPrivateFieldGet(this, _AssertionState_state, "f").assertionCount !== undefined) {
            throw new Error("AssertionCounter was not cleaned up: If tests are not otherwise failing, ensure `expect.hasAssertion` and `expect.assertions` are only run in bdd tests");
        }
    };
    const assertionState = new AssertionState();
    /**
     * return an instance of AssertionState
     *
     * @returns AssertionState
     *
     * @example Usage
     * ```ts ignore
     * import { getAssertionState } from "@std/internal";
     *
     * const assertionState = getAssertionState();
     * assertionState.setAssertionTriggered(true);
     * ```
     */
    function getAssertionState() {
        return assertionState;
    }
});

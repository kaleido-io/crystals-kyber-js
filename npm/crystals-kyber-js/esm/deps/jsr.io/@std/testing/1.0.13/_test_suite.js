// Copyright 2018-2025 the Deno authors. MIT license.
import * as dntShim from "../../../../../_dnt.test_shims.js";
import { getAssertionState } from "../../internal/1.0.8/assertion_state.js";
import { AssertionError } from "../../assert/1.0.13/assertion_error.js";
export const globalSanitizersState = {
    sanitizeExit: undefined,
    sanitizeOps: undefined,
    sanitizeResources: undefined,
};
const assertionState = getAssertionState();
/**
 * An internal representation of a group of tests.
 */
export class TestSuiteInternal {
    constructor(describe) {
        Object.defineProperty(this, "symbol", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "describe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "steps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasOnlyStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.describe = describe;
        this.steps = [];
        this.hasOnlyStep = false;
        const { suite } = describe;
        if (suite && !TestSuiteInternal.suites.has(suite.symbol)) {
            throw new Error("Cannot construct Test Suite: suite does not represent a registered test suite");
        }
        const testSuite = suite
            ? TestSuiteInternal.suites.get(suite.symbol)
            : TestSuiteInternal.current;
        this.symbol = Symbol();
        TestSuiteInternal.suites.set(this.symbol, this);
        const { fn, ignore } = describe;
        if (ignore) {
            const { name, only, permissions, sanitizeExit = globalSanitizersState.sanitizeExit, sanitizeOps = globalSanitizersState.sanitizeOps, sanitizeResources = globalSanitizersState.sanitizeResources, } = describe;
            const options = {
                name,
                fn: async () => { },
                ignore: true,
            };
            if (only !== undefined) {
                options.only = only;
            }
            if (permissions !== undefined) {
                options.permissions = permissions;
            }
            if (sanitizeExit !== undefined) {
                options.sanitizeExit = sanitizeExit;
            }
            if (sanitizeOps !== undefined) {
                options.sanitizeOps = sanitizeOps;
            }
            if (sanitizeResources !== undefined) {
                options.sanitizeResources = sanitizeResources;
            }
            TestSuiteInternal.registerTest(options);
            return;
        }
        if (fn) {
            const temp = TestSuiteInternal.current;
            TestSuiteInternal.current = this;
            try {
                // deno-lint-ignore no-explicit-any
                const value = fn();
                if (value instanceof Promise) {
                    throw new Error('Returning a Promise from "describe" is not supported: tests must be defined synchronously');
                }
            }
            finally {
                TestSuiteInternal.current = temp;
            }
        }
        if (testSuite) {
            TestSuiteInternal.addStep(testSuite, this);
        }
        else {
            const { name, ignore, permissions, sanitizeExit = globalSanitizersState.sanitizeExit, sanitizeOps = globalSanitizersState.sanitizeOps, sanitizeResources = globalSanitizersState.sanitizeResources, } = describe;
            let { only } = describe;
            if (!ignore && this.hasOnlyStep) {
                only = true;
            }
            const options = {
                name,
                fn: async (t) => {
                    TestSuiteInternal.runningCount++;
                    try {
                        const context = {};
                        const { beforeAll } = this.describe;
                        if (typeof beforeAll === "function") {
                            await beforeAll.call(context);
                        }
                        else if (beforeAll) {
                            for (const hook of beforeAll) {
                                await hook.call(context);
                            }
                        }
                        try {
                            TestSuiteInternal.active.push(this.symbol);
                            await TestSuiteInternal.run(this, context, t);
                        }
                        finally {
                            TestSuiteInternal.active.pop();
                            const { afterAll } = this.describe;
                            if (typeof afterAll === "function") {
                                await afterAll.call(context);
                            }
                            else if (afterAll) {
                                for (const hook of afterAll) {
                                    await hook.call(context);
                                }
                            }
                        }
                    }
                    finally {
                        TestSuiteInternal.runningCount--;
                    }
                },
            };
            if (ignore !== undefined) {
                options.ignore = ignore;
            }
            if (only !== undefined) {
                options.only = only;
            }
            if (permissions !== undefined) {
                options.permissions = permissions;
            }
            if (sanitizeExit !== undefined) {
                options.sanitizeExit = sanitizeExit;
            }
            if (sanitizeOps !== undefined) {
                options.sanitizeOps = sanitizeOps;
            }
            if (sanitizeResources !== undefined) {
                options.sanitizeResources = sanitizeResources;
            }
            TestSuiteInternal.registerTest(options);
        }
    }
    /** This is used internally for testing this module. */
    static reset() {
        TestSuiteInternal.runningCount = 0;
        TestSuiteInternal.started = false;
        TestSuiteInternal.current = null;
        TestSuiteInternal.active = [];
    }
    /** This is used internally to register tests. */
    static registerTest(options) {
        options = { ...options };
        if (options.only === undefined) {
            delete options.only;
        }
        if (options.permissions === undefined) {
            delete options.permissions;
        }
        if (options.ignore === undefined) {
            delete options.ignore;
        }
        if (options.sanitizeExit === undefined) {
            delete options.sanitizeExit;
        }
        if (options.sanitizeOps === undefined) {
            delete options.sanitizeOps;
        }
        if (options.sanitizeResources === undefined) {
            delete options.sanitizeResources;
        }
        dntShim.Deno.test(options);
    }
    /** Updates all steps within top level suite to have ignore set to true if only is not set to true on step. */
    static addingOnlyStep(suite) {
        if (!suite.hasOnlyStep) {
            for (let i = 0; i < suite.steps.length; i++) {
                const step = suite.steps[i];
                if (!(step instanceof TestSuiteInternal) && !step.only) {
                    suite.steps.splice(i--, 1);
                }
            }
            suite.hasOnlyStep = true;
        }
        const parentSuite = suite.describe.suite;
        const parentTestSuite = parentSuite &&
            TestSuiteInternal.suites.get(parentSuite.symbol);
        if (parentTestSuite) {
            TestSuiteInternal.addingOnlyStep(parentTestSuite);
        }
    }
    /** This is used internally to add steps to a test suite. */
    static addStep(suite, step) {
        if (!suite.hasOnlyStep) {
            if (step instanceof TestSuiteInternal) {
                if (step.hasOnlyStep || step.describe.only) {
                    TestSuiteInternal.addingOnlyStep(suite);
                }
            }
            else {
                if (step.only)
                    TestSuiteInternal.addingOnlyStep(suite);
            }
        }
        if (!(suite.hasOnlyStep && !(step instanceof TestSuiteInternal) && !step.only)) {
            suite.steps.push(step);
        }
    }
    /** This is used internally to add hooks to a test suite. */
    static setHook(suite, name, fn) {
        if (suite.describe[name]) {
            if (typeof suite.describe[name] === "function") {
                suite.describe[name] = [
                    suite.describe[name],
                ];
            }
            suite.describe[name].push(fn);
        }
        else {
            suite.describe[name] = fn;
        }
    }
    /** This is used internally to run all steps for a test suite. */
    static async run(suite, context, t) {
        const hasOnly = suite.hasOnlyStep || suite.describe.only || false;
        for (const step of suite.steps) {
            if (hasOnly && step instanceof TestSuiteInternal &&
                !(step.hasOnlyStep || step.describe.only || false)) {
                continue;
            }
            const { name, fn, ignore, permissions, sanitizeExit = globalSanitizersState.sanitizeExit, sanitizeOps = globalSanitizersState.sanitizeOps, sanitizeResources = globalSanitizersState.sanitizeResources, } = step instanceof TestSuiteInternal ? step.describe : step;
            const options = {
                name,
                fn: async (t) => {
                    if (permissions) {
                        throw new Error(
                        // deno-lint-ignore deno-style-guide/error-message
                        "permissions option not available for nested tests");
                    }
                    context = { ...context };
                    if (step instanceof TestSuiteInternal) {
                        const { beforeAll } = step.describe;
                        if (typeof beforeAll === "function") {
                            await beforeAll.call(context);
                        }
                        else if (beforeAll) {
                            for (const hook of beforeAll) {
                                await hook.call(context);
                            }
                        }
                        try {
                            TestSuiteInternal.active.push(step.symbol);
                            await TestSuiteInternal.run(step, context, t);
                        }
                        finally {
                            TestSuiteInternal.active.pop();
                            const { afterAll } = step.describe;
                            if (typeof afterAll === "function") {
                                await afterAll.call(context);
                            }
                            else if (afterAll) {
                                for (const hook of afterAll) {
                                    await hook.call(context);
                                }
                            }
                        }
                    }
                    else {
                        await TestSuiteInternal.runTest(t, fn, context);
                    }
                },
            };
            if (ignore !== undefined) {
                options.ignore = ignore;
            }
            if (sanitizeExit !== undefined) {
                options.sanitizeExit = sanitizeExit;
            }
            if (sanitizeOps !== undefined) {
                options.sanitizeOps = sanitizeOps;
            }
            if (sanitizeResources !== undefined) {
                options.sanitizeResources = sanitizeResources;
            }
            await t.step(options);
        }
    }
    static async runTest(t, fn, context, activeIndex = 0) {
        const suite = TestSuiteInternal.active[activeIndex];
        const testSuite = suite && TestSuiteInternal.suites.get(suite);
        if (testSuite) {
            if (activeIndex === 0)
                context = { ...context };
            const { beforeEach } = testSuite.describe;
            if (typeof beforeEach === "function") {
                await beforeEach.call(context);
            }
            else if (beforeEach) {
                for (const hook of beforeEach) {
                    await hook.call(context);
                }
            }
            try {
                await TestSuiteInternal.runTest(t, fn, context, activeIndex + 1);
            }
            finally {
                const { afterEach } = testSuite.describe;
                if (typeof afterEach === "function") {
                    await afterEach.call(context);
                }
                else if (afterEach) {
                    for (const hook of afterEach) {
                        await hook.call(context);
                    }
                }
            }
        }
        else {
            await fn.call(context, t);
        }
        try {
            if (assertionState.checkAssertionErrorState()) {
                throw new AssertionError("Expected at least one assertion to be called but received none");
            }
            if (assertionState.checkAssertionCountSatisfied()) {
                throw new AssertionError(`Expected exactly ${assertionState.assertionCount} ${assertionState.assertionCount === 1 ? "assertion" : "assertions"} to be called, ` +
                    `but received ${assertionState.assertionTriggeredCount}`);
            }
        }
        finally {
            assertionState.resetAssertionState();
        }
    }
}
/** Stores how many test suites are executing. */
Object.defineProperty(TestSuiteInternal, "runningCount", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
/** If a test has been registered yet. Block adding global hooks if a test has been registered. */
Object.defineProperty(TestSuiteInternal, "started", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
/** A map of all test suites by symbol. */
// deno-lint-ignore no-explicit-any
Object.defineProperty(TestSuiteInternal, "suites", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
/** The current test suite being registered. */
// deno-lint-ignore no-explicit-any
Object.defineProperty(TestSuiteInternal, "current", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
/** The stack of tests that are actively running. */
Object.defineProperty(TestSuiteInternal, "active", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: []
});

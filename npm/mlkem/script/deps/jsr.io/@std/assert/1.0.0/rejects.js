(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./assertion_error.js", "./is_error.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertRejects = assertRejects;
    // Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
    // This module is browser compatible.
    const assertion_error_js_1 = require("./assertion_error.js");
    const is_error_js_1 = require("./is_error.js");
    async function assertRejects(fn, errorClassOrMsg, msgIncludesOrMsg, msg) {
        // deno-lint-ignore no-explicit-any
        let ErrorClass = undefined;
        let msgIncludes = undefined;
        let err;
        if (typeof errorClassOrMsg !== "string") {
            if (errorClassOrMsg === undefined ||
                errorClassOrMsg.prototype instanceof Error ||
                errorClassOrMsg.prototype === Error.prototype) {
                // deno-lint-ignore no-explicit-any
                ErrorClass = errorClassOrMsg;
                msgIncludes = msgIncludesOrMsg;
            }
        }
        else {
            msg = errorClassOrMsg;
        }
        let doesThrow = false;
        let isPromiseReturned = false;
        const msgSuffix = msg ? `: ${msg}` : ".";
        try {
            const possiblePromise = fn();
            if (possiblePromise &&
                typeof possiblePromise === "object" &&
                typeof possiblePromise.then === "function") {
                isPromiseReturned = true;
                await possiblePromise;
            }
            else {
                throw Error();
            }
        }
        catch (error) {
            if (!isPromiseReturned) {
                throw new assertion_error_js_1.AssertionError(`Function throws when expected to reject${msgSuffix}`);
            }
            if (ErrorClass) {
                if (!(error instanceof Error)) {
                    throw new assertion_error_js_1.AssertionError(`A non-Error object was rejected${msgSuffix}`);
                }
                (0, is_error_js_1.assertIsError)(error, ErrorClass, msgIncludes, msg);
            }
            err = error;
            doesThrow = true;
        }
        if (!doesThrow) {
            throw new assertion_error_js_1.AssertionError(`Expected function to reject${msgSuffix}`);
        }
        return err;
    }
});

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../src/deps.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDeterministicMlKemClass = getDeterministicMlKemClass;
    const deps_js_1 = require("../src/deps.js");
    function getDeterministicMlKemClass(MlKemClass) {
        // @ts-ignore mixing constructor error expecting any[] as argument
        return class DeterministicMlKem extends MlKemClass {
            // deno-lint-ignore require-await
            async _setup() {
                // @ts-ignore private accessor
                if (this._api !== undefined) {
                    return;
                }
                const shakeInstance = deps_js_1.shake128.create({});
                // @ts-ignore private accessor
                this._api = {
                    getRandomValues: (buffer) => {
                        if (!(buffer instanceof Uint8Array))
                            throw new Error("Unsupported");
                        shakeInstance.xofInto(buffer);
                        return buffer;
                    },
                };
            }
        };
    }
});

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
    exports.testVectorPath = testVectorPath;
    exports.hexToBytes = hexToBytes;
    exports.bytesToHex = bytesToHex;
    exports.hexToDec = hexToDec;
    exports.parseKAT = parseKAT;
    const isDeno = () => typeof Deno !== "undefined";
    function testVectorPath() {
        if (isDeno()) {
            return "./test/vectors";
        }
        return "../../../test/vectors";
    }
    function hexToBytes(v) {
        if (v.length === 0) {
            return new Uint8Array([]);
        }
        const res = v.match(/[\da-f]{2}/gi);
        if (res == null) {
            throw new Error("Not hex string.");
        }
        return new Uint8Array(res.map(function (h) {
            return parseInt(h, 16);
        }));
    }
    function bytesToHex(v) {
        return [...v].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    function hexToDec(hexString) {
        return parseInt(hexString, 16);
    }
    function parseKAT(data) {
        const textByLine = data.trim().split("\n");
        const parsed = {};
        for (let i = 0; i < textByLine.length; i++) {
            const [label, hexValue] = textByLine[i].split(" = ");
            if (label === "count")
                continue;
            const value = hexToBytes(hexValue);
            if (parsed[label]) {
                parsed[label].push(value);
            }
            else {
                parsed[label] = [value];
            }
        }
        return parsed;
    }
});

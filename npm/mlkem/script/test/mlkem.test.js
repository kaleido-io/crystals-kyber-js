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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../_dnt.test_shims.js", "../deps/jsr.io/@std/assert/1.0.0/mod.js", "../deps/jsr.io/@std/testing/1.0.13/bdd.js", "node:fs", "node:readline", "../src/deps.js", "../mod.js", "../src/utils.js", "./utils.js", "./drng.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dntShim = __importStar(require("../_dnt.test_shims.js"));
    const mod_js_1 = require("../deps/jsr.io/@std/assert/1.0.0/mod.js");
    const bdd_js_1 = require("../deps/jsr.io/@std/testing/1.0.13/bdd.js");
    const fs = __importStar(require("node:fs"));
    const readline = __importStar(require("node:readline"));
    const deps_js_1 = require("../src/deps.js");
    const mod_js_2 = require("../mod.js");
    const utils_js_1 = require("../src/utils.js");
    const utils_js_2 = require("./utils.js");
    const drng_js_1 = require("./drng.js");
    function concat(a, b) {
        const ret = new Uint8Array(a.length + b.length);
        ret.set(a, 0);
        ret.set(b, a.length);
        return ret;
    }
    [mod_js_2.MlKem512, mod_js_2.MlKem768, mod_js_2.MlKem1024].forEach((MlKemClass) => (0, bdd_js_1.describe)(MlKemClass.name, () => {
        const size = MlKemClass.name.substring(5);
        const DeterministicMlKemClass = (0, drng_js_1.getDeterministicMlKemClass)(MlKemClass);
        (0, bdd_js_1.describe)("A sample code in README.", () => {
            (0, bdd_js_1.it)("should work normally", async () => {
                const recipient = new MlKemClass();
                const [pkR, skR] = await recipient.generateKeyPair();
                const sender = new MlKemClass();
                const [ct, ssS] = await sender.encap(pkR);
                const ssR = await recipient.decap(ct, skR);
                (0, mod_js_1.assertEquals)(ssS, ssR);
            });
            (0, bdd_js_1.it)("should work normally with deriveKeyPair", async () => {
                const recipient = new MlKemClass();
                const api = await (0, utils_js_1.loadCrypto)();
                const seed = new Uint8Array(64);
                api.getRandomValues(seed);
                const [pkR, skR] = await recipient.deriveKeyPair(seed);
                const [pkR2, skR2] = await recipient.deriveKeyPair(seed);
                (0, mod_js_1.assertEquals)(pkR, pkR2);
                (0, mod_js_1.assertEquals)(skR, skR2);
                const sender = new MlKemClass();
                const [ct, ssS] = await sender.encap(pkR);
                const ssR = await recipient.decap(ct, skR);
                (0, mod_js_1.assertEquals)(ssS, ssR);
            });
        });
        (0, bdd_js_1.describe)("KAT vectors", () => {
            (0, bdd_js_1.it)("should match expected values", async () => {
                const kyber = new MlKemClass();
                const katData = await dntShim.Deno.readTextFile(`${(0, utils_js_2.testVectorPath)()}/kat/kat_MLKEM_${size}.rsp`);
                const { z, d, ct, sk, ss, msg, pk } = (0, utils_js_2.parseKAT)(katData);
                console.log(`KAT test vector count: ${sk.length}`);
                for (let i = 0; i < sk.length; i++) {
                    const [pkActual, skActual] = await kyber.deriveKeyPair(concat(d[i], z[i]));
                    (0, mod_js_1.assertEquals)(pkActual, pk[i]);
                    (0, mod_js_1.assertEquals)(skActual, sk[i]);
                    const ssDecapActual = await kyber.decap(ct[i], sk[i]);
                    (0, mod_js_1.assertEquals)(ssDecapActual, ss[i]);
                    const [ctActual, ssEncapActual] = await kyber.encap(pk[i], msg[i]);
                    (0, mod_js_1.assertEquals)(ctActual, ct[i]);
                    (0, mod_js_1.assertEquals)(ssEncapActual, ss[i]);
                }
            });
        });
        (0, bdd_js_1.describe)("CCTV/ML-KEM/modulus", () => {
            (0, bdd_js_1.it)("Invalid encapsulation keys", async () => {
                const sender = new MlKemClass();
                const rl = readline.createInterface({
                    input: fs.createReadStream(`${(0, utils_js_2.testVectorPath)()}/modulus/ML-KEM-${size}.txt`),
                    crlfDelay: Infinity,
                });
                try {
                    let count = 0;
                    for await (const line of rl) {
                        const invalidPk = (0, utils_js_2.hexToBytes)(line);
                        await (0, mod_js_1.assertRejects)(() => sender.encap(invalidPk), mod_js_2.MlKemError, "invalid encapsulation key");
                        count++;
                    }
                    console.log(`CCTV/ML-KEM/modulus test vector count: ${count}`);
                }
                catch (e) {
                    console.error(e);
                }
                finally {
                    rl.close();
                }
            });
        });
        (0, bdd_js_1.describe)("CCTV/ML-KEM/strcmp", () => {
            (0, bdd_js_1.it)("strcmp vectors that fail strcmp() is used in decap.", async () => {
                const kyber = new MlKemClass();
                const testData = await dntShim.Deno.readTextFile(`${(0, utils_js_2.testVectorPath)()}/strcmp/ML-KEM-${size}.txt`);
                const { c: [ct], dk: [sk], K: [ss] } = (0, utils_js_2.parseKAT)(testData);
                const res = await kyber.decap(ct, sk);
                (0, mod_js_1.assertEquals)(res, ss);
                console.log("CCTV/ML-KEM/strcmp test vector count: 1");
            });
        });
        (0, bdd_js_1.describe)("CCTV/ML-KEM/unluckysample", () => {
            (0, bdd_js_1.it)("Unlucky NTT sampling vectors that require an unusually large number of XOF reads", async () => {
                const kyber = new MlKemClass();
                const testData = await dntShim.Deno.readTextFile(`${(0, utils_js_2.testVectorPath)()}/unluckysample/ML-KEM-${size}.txt`);
                const { c: [ct], dk: [sk], K: [ss] } = (0, utils_js_2.parseKAT)(testData);
                const res = await kyber.decap(ct, sk);
                (0, mod_js_1.assertEquals)(res, ss);
                console.log("CCTV/ML-KEM/unluckysample test vector count: 1");
            });
        });
        (0, bdd_js_1.describe)("pq-crystals/kyber", () => {
            (0, bdd_js_1.it)("Accumulated vectors", async () => {
                const deterministicMlKem = new DeterministicMlKemClass();
                const shakeInstance = deps_js_1.shake128.create({ dkLen: 32 });
                /**
                 * For each test, the following values are drawn from the RNG in order:
                 *
                 * d for K-PKE.KeyGen
                 * z for ML-KEM.KeyGen
                 * m for ML-KEM.Encaps
                 * ct as an invalid ciphertext input to ML-KEM.Decaps
                 * Then, the following values are written to a running SHAKE-128 instance in order:
                 *
                 * ek from ML-KEM.KeyGen
                 * dk from ML-KEM.KeyGen
                 * ct from ML-KEM.Encaps
                 * k from ML-KEM.Encaps (which should be checked to match the output of ML-KEM.Decaps when provided with the correct ct)
                 * k from ML-KEM.Decaps when provided with the random ct
                 * The resulting hashes for 10 000 consecutive tests are:
                 */
                const count = 100;
                const expectedHashes = {
                    "MlKem512": "449120c6e320ef3e9fbfa2316e5f2d2e1e6dd37d8ff5d086d5d2db7d42aff0a1",
                    "MlKem768": "8d65b902f28edc683cebee2872962fd165a4d197c9e24ec74caa4470270df0b7",
                    "MlKem1024": "c3ffe9ebecfa479c142656cbfbc6417efa05b77e994fe538eef4daed166363df",
                };
                // const count = 10000;
                // const expectedHashes: { [key: string]: string } = {
                //   "MlKem512":
                //     "705dcffc87f4e67e35a09dcaa31772e86f3341bd3ccf1e78a5fef99ae6a35a13",
                //   "MlKem768":
                //     "f959d18d3d1180121433bf0e05f11e7908cf9d03edc150b2b07cb90bef5bc1c1",
                //   "MlKem1024":
                //     "e3bf82b013307b2e9d47dde791ff6dfc82e694e6382404abdb948b908b75bad5",
                // };
                // const count = 1000000;
                // const expectedHashes: { [key: string]: string } = {
                //   "MlKem512":
                //     "21dd330d4355f2ae2876b9fa2b9de62ecaf76aca1d598de8db2b467d36e36a6a",
                //   "MlKem768":
                //     "3b108396a277f2952ff3243a985c9709bcb95788c39b7b36a2c4e19d1a41e51e",
                //   "MlKem1024":
                //     "6377c4f0ecfdb32e63f7b58227960828784fe0b3e0e5e5e9f77be300f003512a",
                // };
                console.log("pq-crystals/kyber test vector count:", count);
                for (let i = 0; i < count; i++) {
                    const [ek, dk] = await deterministicMlKem.generateKeyPair();
                    const [ct, k] = await deterministicMlKem.encap(ek);
                    const kActual = await deterministicMlKem.decap(ct, dk);
                    (0, mod_js_1.assertEquals)(kActual, k);
                    // sample random, invalid ct
                    // @ts-ignore private accessor
                    const ctRandom = deterministicMlKem._api.getRandomValues(new Uint8Array(ct.length));
                    const kRandom = await deterministicMlKem.decap(ctRandom, dk);
                    // hash results
                    shakeInstance.update(ek)
                        .update(dk)
                        .update(ct)
                        .update(k)
                        .update(kRandom);
                }
                const actualHash = shakeInstance.digest();
                (0, mod_js_1.assertEquals)((0, utils_js_2.bytesToHex)(actualHash), expectedHashes[MlKemClass.name]);
            });
        });
    }));
});

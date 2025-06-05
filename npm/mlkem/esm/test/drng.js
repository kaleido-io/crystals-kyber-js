import { shake128 } from "../src/deps.js";
export function getDeterministicMlKemClass(MlKemClass) {
    // @ts-ignore mixing constructor error expecting any[] as argument
    return class DeterministicMlKem extends MlKemClass {
        // deno-lint-ignore require-await
        async _setup() {
            // @ts-ignore private accessor
            if (this._api !== undefined) {
                return;
            }
            const shakeInstance = shake128.create({});
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

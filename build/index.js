/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as cp from "node:child_process";
import { once } from "node:events";
import { aggregate } from "./aggregate.js";
import args from "./args.js";
const iterations = parseInt(Number(args.iteration).toString());
const test = args.test;
const MODULES = {
    streams: "./build/streams.js",
    winston: "./build/winston.js",
    pino: "./build/pino.js",
};
const result = {};
for (let i = 0; i < iterations; i++) {
    for (let [name, path] of Object.entries(MODULES)) {
        const f = cp.fork(path, [`test=${test}`]);
        f.on("message", (message) => {
            const { event, data } = message;
            if (event == "result") {
                if (!result[name]) {
                    result[name] = [];
                }
                result[name].push(data);
            }
        });
        await once(f, "exit");
    }
}
console.log(aggregate(result, iterations));

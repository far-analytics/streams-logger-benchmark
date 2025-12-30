/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./result.js";
import * as stream from "node:stream";
import { pino } from "pino";
import pretty from "pino-pretty"; // ✅ NEW (stream, not transport)
import args from "./args.js";
const run = (await import(`./${args.test}.js`)).default;
stream.setDefaultHighWaterMark(true, 1e5);
stream.setDefaultHighWaterMark(false, 1e5);
// ✅ NEW: pretty stream (runs on main thread)
const prettyStream = pretty({
    colorize: false,
    translateTime: 'yyyy-mm-dd"T"HH:MM:ss.l"Z"',
    levelFirst: false,
    messageFormat: "{msg}",
    ignore: "pid,hostname",
});
// ✅ NEW: pipe explicitly
prettyStream.pipe(process.stdout);
const log = pino({
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
}, prettyStream // ✅ replaces `transport`
);
run(log);

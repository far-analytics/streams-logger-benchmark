/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./result.js";
import * as stream from "node:stream";
// import * as fs from "node:fs";
import { pino } from "pino";
import args from "./args.js";

const run = (await import(`./${args.test}.js`)).default;

stream.setDefaultHighWaterMark(true, 1e5);
stream.setDefaultHighWaterMark(false, 1e5);

const log = pino({
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: false,
      translateTime: 'yyyy-mm-dd"T"HH:MM:ss.l"Z"',
      levelFirst: false,
      messageFormat: "{msg}",
      ignore: "pid,hostname",
    },
  },
});

run(log);

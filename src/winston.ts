/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "./result.js";
import * as stream from "node:stream";
import * as fs from "node:fs";
import { transports, createLogger, format } from "winston";
import args from "./args.js";
const run = (await import(`./${args.test}.js`)).default;

stream.setDefaultHighWaterMark(true, 1e5);
stream.setDefaultHighWaterMark(false, 1e5);

const { combine, timestamp, printf } = format;

if (fs.existsSync("winston.log")) {
  fs.rmSync("winston.log");
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const log = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: () => new Date().toISOString(),
    }),
    logFormat
  ),
  transports: [new transports.Console()],
});

run(log);

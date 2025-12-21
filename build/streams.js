/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./result.js";
// import * as stream from "node:stream";
// import * as fs from "node:fs";
import { Logger, Formatter, ConsoleHandler, SyslogLevel, Config } from "streams-logger";
import args from "./args.js";
const run = (await import(`./${args.test}.js`)).default;
// stream.setDefaultHighWaterMark(true, 1e5);
// stream.setDefaultHighWaterMark(false, 1e5);
Config.highWaterMark = 1e5;
Config.highWaterMarkObjectMode = 1e5;
const logger = new Logger({ level: SyslogLevel.DEBUG, name: "test", captureStackTrace: false });
const formatter = new Formatter({
    format: ({ isotime, message, level }) => {
        return `[${isotime ?? ""}] ${level}: ${message}\n`;
    },
});
const consoleHandler = new ConsoleHandler({ level: SyslogLevel.DEBUG });
const log = logger.connect(formatter.connect(consoleHandler));
run(log);

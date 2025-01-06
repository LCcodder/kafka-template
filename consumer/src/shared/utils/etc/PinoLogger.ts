import pino from "pino";
const pretty = require('pino-pretty')

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",

    options: {
      colorize: true,
      ignore: "pid,hostname",
      timestampKey: "time",
      levelFirst: true,
      messageFormat: true,
      customColors: "err:red,info:blue"
    }
  }
}, pretty({ coloroze: true }));

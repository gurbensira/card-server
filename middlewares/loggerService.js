import config from "config";
import logger from "./logger.js";
import { simpleLogger } from "./simpleLogger.js";

const loggerConfig = config.get("LOGGER");
console.log(`App using ${loggerConfig.toUpperCase()} logger`);
const serverLogger = loggerConfig === "morgan" ? logger : simpleLogger;

export default serverLogger;






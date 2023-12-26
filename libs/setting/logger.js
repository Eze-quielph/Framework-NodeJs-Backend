
class CreateLogger {
  log(msg) {
    console.ingo("Message info: " + msg);
  }

  error(msg) {
    console.error("Message error: " + msg);
  }

  warn(msg) {
    console.warn("Message warn: " + msg);
  }
}
const createLogger = new CreateLogger();

module.exports = createLogger;
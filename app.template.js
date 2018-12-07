const path = require("path");
const os = require("os");
const carlo = require("carlo");

const URL = __URL__;
const appName = __NAME__;

(async () => {
  let app;
  try {
    app = await carlo.launch({
      title: appName,
      icon: __ICON__ ? path.join(__dirname, __ICON__) : null,
      channel: ["canary", "stable"],
      localDataDir: path.join(os.homedir(), `.${appName}`)
    });
  } catch (e) {
    console.error(e);
    return;
  }
  app.on("exit", () => process.exit());
  // New windows are opened when this app is started again from command line.
  app.on("window", window => window.load(URL));
  await app.load(URL);
})();

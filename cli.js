#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { parse: parseUrl } = require("url");
const pkg = require("pkg");
const pageIcon = require("page-icon");

const params = process.argv.slice(2);

let [url, name] = params;

if (!url) {
  console.log("You need to provide an url");
  return;
}

if (!parseUrl(url).protocol) {
  url = `https://${url}`;
}

if (!name) {
  name = parseUrl(url).hostname;
}

(async () => {
  let iconFileName = null;

  try {
    console.log("Searching for icon...");
    const icon = await pageIcon(url, { ext: ".png" });
    console.log("Icon found: ", icon.source);

    iconFileName = "icon" + icon.ext;
    fs.writeFileSync(iconFileName, icon.data);
  } catch (e) {
    console.log("Icon not found");
  }

  let file = fs
    .readFileSync(path.join(__dirname, "app.template.js"), "utf8")
    .replace(/__URL__/g, JSON.stringify(url))
    .replace(/__NAME__/g, JSON.stringify(name))
    .replace(/__ICON__/g, JSON.stringify(iconFileName));

  const appFileName = "app.js";

  fs.writeFileSync(appFileName, file);

  console.log("building...");

  pkg.exec([appFileName, "--target", "host", "--output", name]).then(() => {
    fs.unlinkSync(iconFileName);
    fs.unlinkSync(appFileName);
    console.log("done!");
  });
})();

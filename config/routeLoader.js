/* eslint-disable prefer-rest-params */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

module.exports = function loadFiles() {
  // Inject automatically all Routes
  getDirectories("./components").forEach(componentSubFolder => {
    readdirSync(componentSubFolder).forEach(file => {
      if (file.endsWith("Route.js")) {
        global.logger.info(`[Route] -> Load Route from ${file}`);
        require(join(process.cwd(), componentSubFolder, file.slice(0, -3)))(...arguments);
      }
    });
  });
};

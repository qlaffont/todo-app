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
  const models = [];

  getDirectories("./components").forEach(componentSubFolder => {
    readdirSync(componentSubFolder).forEach(file => {
      if (file.endsWith("Model.js")) {
        global.logger.info(`[Model] -> Load Model from ${file}`);
        let modelName = file.slice(0, -8);
        modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1, -1);

        models[modelName] = require(join(process.cwd(), componentSubFolder, file.slice(0, -3)))(
          ...arguments
        );
      }
    });
  });

  return models;
};

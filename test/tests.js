/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { join } = require("path");
const { lstatSync, readdirSync } = require("fs");
const mongoose = require("mongoose");

// Set Up Tests Env Var
process.env.MONGODB_URI = process.env.MONGODB_URI  || "mongodb://127.0.0.1/todoapp-test";

// Clean DB Before Start
describe("Start Test", () => {
  before(done => {
    mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useCreateIndex: true },
      () => {
        mongoose.connection.db.dropDatabase(() => {
          done();
        });
      }
    );
  });

  // Start API
  const server = require("./../index");

  chai.use(chaiHttp);

  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source =>
    readdirSync(source)
      .map(name => join(source, name))
      .filter(isDirectory);

  getDirectories("./components").forEach(componentSubFolder => {
    readdirSync(join(process.cwd(), componentSubFolder)).forEach(file => {
      if (file.endsWith("Tests.js")) {
        require(join(process.cwd(), componentSubFolder, file.slice(0, -3)))(chai, server);
      }
    });
  });
});

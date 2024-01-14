const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");
const percyHealthCheck = require("@percy/cypress/task");

module.exports = on => {
    on("file:preprocessor", cypressTypeScriptPreprocessor);
    on("task", percyHealthCheck);
};

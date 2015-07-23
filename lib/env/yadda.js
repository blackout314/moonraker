var parser  = require('../utils/feature-parser'),
    session = require('moonraker').session,
    config  = require('moonraker').config,
    Yadda   = require('yadda'),
    glob    = require('glob'),
    chai    = require('chai'),
    path    = require('path');

require('coffee-script/register');

var language = parser.getLanguage(config.language);

Yadda.plugins.mocha.StepLevelPlugin.init({ language: language });
chai.should();

var library = loadStepDefs(language);

features(session.queue, function (feature) {
  scenarios(feature.scenarios, function (scenario) {
    steps(scenario.steps, function (step, done) {
      if (step === scenario.steps[0]) session.reset();
      session.execute(function () {
        new Yadda.Yadda(library).yadda(step);
      }).then(done);
    });
  });
});

function loadStepDefs(language) {
  var currentDirectory = path.dirname(process.argv[1]);
  var dictionary = new Yadda.Dictionary();

  if (config.dictionaryFile){
    try{
      var customDict = require(path.join(currentDirectory, '../../../../', config.dictionaryFile));
      for(var k in customDict){
        if (customDict.hasOwnProperty(k)){
          dictionary.define(k, new RegExp(customDict[k]))
        }
      }
    }catch(e){
      console.warn("*** Defining custom dictionary failed:", e.message);
    }
  }

  var library = new language.library(dictionary);
  glob.sync(config.stepsDir + "/**/*.+(js|coffee)").forEach(function (file) {
    var steps = require(path.join(currentDirectory, '../../../../', file));
    try {
      steps.define(library);
    } catch (e) {
      if (e instanceof TypeError) {
        console.warn("*** File: " + file + " contained no step definitions\n");
      }
    }
  });
  return library;
}

afterEach(function () {
  if (this.currentTest.state !== 'passed') {
    session.saveScreenshot(this.currentTest.title);
  }
});

after(function (done) {
  session.getDriver().quit().then(done);
});

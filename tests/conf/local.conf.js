const Services = {}; loadServices();

const baseCapabilities = {}

function capabilitiesForBrowser(browserName) {
  return {
    ...baseCapabilities,
    'browser': browserName
  }
}

const nightwatch_config = {
  src_folders: [ "research_app" ],
  page_objects_path: ["page_objects"],
  custom_assertions_path: [],

  webdriver: {
    "start_process": true,
    "port": 9515,
    "server_path": require('geckodriver').path,
    "cli_args": {
      "webdriver.gecko.driver": require('geckodriver').path,
      "webdriver.chrome.driver": require('chromedriver').path,
      "--log": "debug",
    }
  },

  globals_path: '',
  
  test_settings: {
    default: {
      desiredCapabilities: capabilitiesForBrowser('chrome')
    },
    firefox: {
      desiredCapabilities: capabilitiesForBrowser('firefox')
    },
    edge: {
      desiredCapabilities: capabilitiesForBrowser('edge')
    },
    safari: {
      desiredCapabilities: capabilitiesForBrowser('safari')
    },
    opera: {
      desiredCapabilities: capabilitiesForBrowser('opera')
    }
  }
};

module.exports = nightwatch_config;
  
function loadServices() {
  try {
    Services.seleniumServer = require('selenium-server');
  } catch (err) {}

  try {
    Services.chromedriver = require('chromedriver');
  } catch (err) {}

  try {
    Services.geckodriver = require('geckodriver');
  } catch (err) {}
}
  
const Services = {}; loadServices();

const directory = __dirname;

const nightwatch_config = {
  src_folders: [directory + "/dist/tests/research_app"],
  page_objects_path: [directory + "/page_objects"],
  custom_assertions_path: [],
  disable_typescript: true,

  webdriver: {
    "start_process": true,
    "host": "127.0.0.1",
    "port": 9515,
    "server_path": Services.chromedriver ? Services.chromedriver.path : '',
    "cli_args": {
      "--log": "debug",
    }
  },

  globals_path: '',
  
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
      webdriver: {
        start_process: true,
        server_path: Services.chromedriver ? Services.chromedriver.path : '',
      },
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
      webdriver: {
        start_process: true,
        port: 9515,
        server_path: Services.chromedriver ? Services.chromedriver.path : '',
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: Services.geckodriver ? Services.geckodriver.path : '',
      },
    },
    edge: {
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      },
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: Services.edgedriver ? Services.edgedriver.path : '',
      }
    },
    // safari: {
    //   desiredCapabilities: {
    //     browserName: 'safari'
    //   }
    // },
    // opera: {
    //   desiredCapabilities: {
    //     browserName: 'opera'
    //   }
    // }
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

  try {
    Services.edgedriver = require('edgedriver');
  } catch (err) {}
}
  
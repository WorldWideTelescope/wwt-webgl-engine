const baseCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local': true,
  'name': 'Bstack-[Nightwatch] Local Test'
}

function capabilitiesForBrowser(browserName) {
  return {
    ...baseCapabilities,
    'browser': browserName
  }
}

const directory = __dirname;

const nightwatch_config = {
  src_folders: [directory + "/dist/tests/research_app"],
  page_objects_path: [directory + "/page_objects"],
  custom_assertions_path: [],
  disable_typescript: true,
  
  selenium : {
    "start_process" : false,
    "host" : "hub-cloud.browserstack.com",
    "port" : 443,

    //"proxy": "http://PROXY_USERNAME:PROXY_PASSWORD@proxy-host:proxy-port"  // If you are behind a proxy
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
    // safari: {
    //   desiredCapabilities: capabilitiesForBrowser('safari')
    // },
    // opera: {
    //   desiredCapabilities: capabilitiesForBrowser('opera')
    // }
  }
};
  
// Code to copy seleniumhost/port into test settings
for (var i in nightwatch_config.test_settings) {
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}
module.exports = nightwatch_config;
  
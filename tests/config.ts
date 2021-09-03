// The creation of the capabilities is based on 
// https://www.browserstack.com/automate/capabilities
export interface SeleniumSettings {
  start_process: boolean;
  host: string;
  port: number;
}

export interface WebDriverSettings {
  start_process: boolean;
  server_path: string;
  host?: string;
  port?: number;
  cli_args?: { [key: string]: string | undefined };
}

export interface Capabilities {
  browserName: string,
}

export interface BrowserCapabilities extends Capabilities {
  browser_version: string,
  os: string,
  os_version: string;
}

export interface MobileCapabilities extends Capabilities {
  device: string,
  real_mobile: boolean,
  os_version: string;
}

export interface TestEnvironment {
  desiredCapabilities: Capabilities;
  selenium_host?: string;
  selenium_port?: number;
  webdriver?: WebDriverSettings;
}

export interface Configuration {
  src_folders: string[],
  page_objects_path: string[],
  custom_assertions_path: string[],
  disable_typescript: boolean,
  selenium?: SeleniumSettings,
  webdriver?: WebDriverSettings,
  globals_path: string,
  test_settings: { [env: string]: TestEnvironment | undefined }
}

export function browserCapabilities(browserName: string, browserVersion: string, osName: string, osVersion: string): BrowserCapabilities {
  return {
    'browserName': browserName,
    'browser_version': browserVersion,
    'os': osName,
    'os_version': osVersion,
  }
}

export function mobileCapabilities(deviceOS: string, deviceName: string, osVersion: string, realMobile: boolean=true): MobileCapabilities {
  return {
    'device': deviceName,
    'os_version': osVersion,
    'real_mobile': realMobile,
    'browserName': deviceOS, // Seems strange, but this is what BrowserStack shows in their examples
  }
}

export function addBrowsers(environments: { [env: string]: TestEnvironment | undefined }, baseCapabilities: object, osName: string, osVersions: string[], browsers: string[], envKeyMaker: (version: string, browser: string) => string) {
  for (const version of osVersions) {
    for (const browser of browsers) {
      const key = envKeyMaker(version, browser);
      environments[key] = {
          desiredCapabilities: {
            ...baseCapabilities,
            ...browserCapabilities(browser, 'latest', osName, version)
          }
      };
    }
  }
}

export function addPhones(environments: { [env: string]: TestEnvironment | undefined }, baseCapabilities: object, osType: string, devicesAndVersions: string[][], envKeyMaker: (device: string, osVersion: string) => string, realMobile: boolean=true) {
  for (const [device, osVersion] of devicesAndVersions) {
    const key = envKeyMaker(device, osVersion);
    environments[key] = {
        desiredCapabilities: {
        ...baseCapabilities,
        ...mobileCapabilities(osType, device, osVersion, realMobile)
    }
    };
  }
}

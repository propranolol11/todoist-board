let requestUrlImpl = async function requestUrlDefault() {
  throw new Error("requestUrl is not available in pure unit tests");
};
let requiredApiVersionAvailable = false;

export function requireApiVersion() {
  return requiredApiVersionAvailable;
}

export function __setRequireApiVersion(available) {
  requiredApiVersionAvailable = available;
}

export async function requestUrl(...args) {
  return requestUrlImpl(...args);
}

export function __setRequestUrl(fn) {
  requestUrlImpl = fn;
}

export function __resetRequestUrl() {
  requiredApiVersionAvailable = false;
  requestUrlImpl = async function requestUrlDefault() {
    throw new Error("requestUrl is not available in pure unit tests");
  };
}

export class App {}
export class Modal {}
export class Plugin {}
export class PluginSettingTab {}
export class Setting {}
export class ItemView {}
export class Menu {
  addItem() {
    return this;
  }

  addSeparator() {}
  showAtPosition() {}
}
export class MenuItem {}
export class Notice {}
export class MarkdownPostProcessorContext {}
export class MarkdownRenderer {}

export function setIcon() {}

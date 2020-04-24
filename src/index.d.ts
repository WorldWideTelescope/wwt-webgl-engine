// TypeScript definitions for the WWT WebGL engine

export as namespace wwtlib;

export class WWTControl {
  gotoRADecZoom(ra_hours: number, dec_deg: number, zoom: number, instant: boolean): void;
}

export class ScriptInterface {
  /** Get the current RA, IN WHAT UNITS? */
  getRA(): number;
  getDec(): number;
}

export namespace WWTControl {
  export function initControlParam(divId: string, use_webgl: boolean): ScriptInterface;
}
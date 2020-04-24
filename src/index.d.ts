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
  /** Initialize the WWT engine and launch its rendering loop.
   * 
   * @param divId The `id` of the DOM element into which the WWT WebGL surface will be inserted.
   * @return A handle to a [[ScriptInterface]] associated with this engine instance.
   * 
   * The engine is not immediately usable since it must perform initialization that
   * includes fetching resources from the network.
   */
  export function initControl(divId: string): ScriptInterface;
}
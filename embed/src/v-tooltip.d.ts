declare module "v-tooltip" {
  import Vue, { VueConstructor, DirectiveOptions, PluginFunction } from 'vue';

  export const vToolTip: PluginFunction<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any
  export default vToolTip;

  export const VPopover: VueConstructor<Vue>;
  export const VClosePopover: DirectiveOptions;
  export const VTooltip: DirectiveOptions;
}
declare module "*.vue" {
  import { defineComponent } from "vue";

  // For reasons unclear to me, the docstring for the WWTComponent component
  // defined in `Component.vue` has to go here for typedoc to handle it
  // correctly.

  /** This variable defines the WorldWide Telescope Vue component.
   *
   * In most cases, you would use it in the following way while initializing
   * your Vue app:
   *
   * ```ts
   * import { createApp } from "vue";
   * import { wwtPinia, WWTComponent } from "@wwtelescope/engine-pinia";
   *
   * import MyApp from "./MyApp.vue";
   *
   * createApp(MyApp)
   *   .use(wwtPinia)
   *   .component("WorldWideTelescope", WWTComponent)
   *   .mount("#app");
   * ```
   *
   * Then, one of your app’s component templates could use a
   * `<WorldWideTelescope>` tag to insert a WWT display. Your other components
   * could then use the APIs defined in [The WWT Pinia
   * Interface](../classes/WWTAwareComponent.html#md:the-wwt-pinia-interface) to
   * monitor and control the WWT’s status.
   */
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

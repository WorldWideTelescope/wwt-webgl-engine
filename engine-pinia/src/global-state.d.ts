import 'pinia';
import { WWTGlobalState } from './store';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    /** @hidden */
    $wwt: WWTGlobalState;
  }
}

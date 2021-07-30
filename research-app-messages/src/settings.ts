// Copyright 2021 the .NET Foundation
// Licensed under the MIT License

/** Various settings for the research app itself.
 *
 * This module contains messages and types relating to generic "settings" of the
 * research app that can be controlled. The [[classicPywwt]] module defines many
 * other settings and messages that control the appearance of graphical elements
 * in the WWT engine such as layers and annotations.
 *
 * The defined messages are:
 *
 * - [[ModifySettingsMessage]]
 * */

/** An identifier of something with settings that can be modified.
 *
 * Right now, the only available option is the top-level application. In the
 * future this type might become an enumeration with multiple allowed values.
 * */
export type SettingsTarget = "app";

/** A generic setting.
 *
 * In this package, settings are expressed as 2-tuples of a setting name and a
 * setting value. In some places, settings are strongly-typed, but it is
 * convenient to have a weakly-typed form as well.
 * */
export type GenericSetting = [string, any];  // eslint-disable-line @typescript-eslint/no-explicit-any

/** Type guard function for [[GenericSetting]]. */
export function isGenericSetting(obj: any): obj is GenericSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return Object.prototype.toString.call(obj) === '[object Array]' &&
    obj.length == 2 &&
    typeof obj[0] === "string";
}

/** Settings for the overall application.
 *
 * This should be thought of as an enumeration type, all of whose options are
 * compatible with [[GenericSetting]]. Right now, there is only one option
 * available, though.
 * */
export type AppSetting =
  ["hideAllChrome", boolean];

const appSettingTypeInfo: { [i: string]: boolean } = {
  "hideAllChrome/boolean": true,
};

/** Type guard function for [[AppSetting]]. */
export function isAppSetting(obj: GenericSetting): obj is AppSetting {
  const key = obj[0] + "/" + typeof obj[1];
  return (key in appSettingTypeInfo);
}


/** A message to modify various settings in a generic way.
 *
 * This is the generic message to be used for modifying settings. Its
 * [[settings]] payload is weakly-typed.
*/
export interface ModifySettingsMessage {
  /** The tag identifying this message type. */
  event: "modify_settings";

  /** The target of the settings modification. */
  target: SettingsTarget;

  /** The settings to modify. */
  settings: GenericSetting[];
}

/** A type-guard-like function for the app mode of [[ModifySettingsMessage]].
 *
 * @param o An object that might be a [[ModifySettingsMessage]]
 * @returns A list of recognized [[AppSetting]]s in the message if so; otherwise null
 *
 * This function is like a type guard for the [[ModifySettingsMessage]]
 * interface, with the additional constraint that it only matches messages
 * targeting the overall app. If that is the case, it returns an array of the
 * settings that matched this package's knowledge of acceptable app settings.
 * Unrecognized settings are filtered out from the return value.
 *
 * If the message does not seem to be a settings-modification message, null is
 * returned.
 */
export function maybeAsModifiedAppSettings(o: any): AppSetting[] | null {  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (o.event !== "modify_settings" || o.target !== "app")
    return null;
  if (Object.prototype.toString.call(o.settings) !== '[object Array]')
    return null;

  const accepted: AppSetting[] = [];

  for (const item of o.settings) {
    if (isGenericSetting(item) && isAppSetting(item)) {
      accepted.push(item);
    }
  }

  return accepted;
}

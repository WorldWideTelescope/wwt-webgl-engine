// Copyright 2021-2023 the .NET Foundation
// Licensed under the MIT License

// Note: module-level docstring found in `index.ts`

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

/** Type guard function for {@link GenericSetting}. */
export function isGenericSetting(obj: any): obj is GenericSetting {  // eslint-disable-line @typescript-eslint/no-explicit-any
  return Object.prototype.toString.call(obj) === '[object Array]' &&
    obj.length == 2 &&
    typeof obj[0] === "string";
}

/** Settings for the overall application.
 *
 * This should be thought of as an enumeration type, all of whose options are
 * compatible with {@link GenericSetting}. Right now, there are only two options
 * available, though.
 * */
export type AppSetting =
  ["hideAllChrome", boolean] |
  ["selectionProximity", number];

const appSettingTypeInfo: { [i: string]: boolean | number } = {
  "hideAllChrome/boolean": true,
  "selectionProximity/number": 4
};

/** Type guard function for {@link AppSetting}. */
export function isAppSetting(obj: GenericSetting): obj is AppSetting {
  const key = obj[0] + "/" + typeof obj[1];
  return (key in appSettingTypeInfo);
}


/** A message to modify various settings in a generic way.
 *
 * This is the generic message to be used for modifying settings. Its
 * {@link settings} payload is weakly-typed.
*/
export interface ModifySettingsMessage {
  /** The tag identifying this message type. */
  event: "modify_settings";

  /** The target of the settings modification. */
  target: SettingsTarget;

  /** The settings to modify. */
  settings: GenericSetting[];
}

/** A type-guard-like function for the app mode of {@link ModifySettingsMessage}.
 *
 * @param o An object that might be a {@link ModifySettingsMessage}
 * @returns A list of recognized {@link AppSetting}s in the message if so; otherwise null
 *
 * This function is like a type guard for the {@link ModifySettingsMessage}
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

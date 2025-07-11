// Copyright 2020 the .NET Foundation
// Licensed under the MIT License

/** The mathematical constant pi, around 3.14. */
export const PI = 3.14159265358979;

/** Two times the mathematical constan pi, around 6.28. */
export const TWOPI = 2 * PI;

/** Radians-to-degrees conversion factor.
 *
 * ```
 * let degrees = radians * R2D;
 * ```
 */
export const R2D = 180 / PI;

/** Degrees-to-radians conversion factor.
 *
 * ```
 * let radians = degrees * D2R;
 * ```
 */
export const D2R = PI / 180;

/** Radians-to-hours conversion factor.
 *
 * ```
 * let hours = radians * R2H;
 * ```
 */
export const R2H = 12 / PI;

/** Hours-to-radians conversion factor.
 *
 * ```
 * let radians = hours * H2R;
 * ```
 */
export const H2R = PI / 12;

/** Degrees-to-hours conversion factor.
 *
 * ```
 * let hours = degrees * D2H;
 * ```
 */
export const D2H = 12. / 180;

/** Hours-to-degrees conversion factor.
 *
 * ```
 * let degrees = hours * H2D;
 * ```
 */
export const H2D = 15;

/** Normalize an angle in radians to lie between 0 and 2pi.
 *
 * @param angleRad The input angle, in radians.
 * @returns An equivalent angle, also in radians.
 */
export function angnorm(angleRad: number): number {
  while (angleRad < 0)
    angleRad += TWOPI;
  while (angleRad >= TWOPI)
    angleRad -= TWOPI;
  return angleRad;
}

/**
 * Find the great-circle distance between two points
 *
 * This implementation uses a special case of the Vincenty formula
 * See the last formula in https://en.wikipedia.org/wiki/Great-circle_distance#Computational_formulas
 *
 * @param ra1 The right ascension of the first point, in radians
 * @param dec1 The declination of the first point, in radians
 * @param ra2 The right ascension of the second point, in radians
 * @param dec2 The declination of the second point, in radians
 * @returns The great-circle distance
 */
 export function distance(ra1: number, dec1: number, ra2: number, dec2: number): number {
  const dAbsRA = Math.abs(ra1 - ra2);
  const nt1 = (Math.cos(dec2) * Math.sin(dAbsRA)) ** 2;
  const nt2 = (Math.cos(dec1) * Math.sin(dec2) - Math.sin(dec1) * Math.cos(dec2) * Math.cos(dAbsRA)) ** 2;
  const num = Math.sqrt(nt1 + nt2);
  const den = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(dAbsRA);
  return Math.atan2(num, den);
}

/** Options for {@link formatSexagesimal} */
export interface FormatSexagesimalOptions {
  /** The numerical value to format */
  value: number;

  /** Whether to show a leading plus if the value is positive */
  showPlus: boolean;

  /** The number of digits to which to pad the whole number part of the formatted expression */
  padWhole: number;

  /** The separator between the first two pieces of the formatted expression */
  firstSeparator: string;

  /** The separator between the second two pieces of the formatted expression */
  secondSeparator: string;

  /** If given, a suffix appended to the end of the formatted expression */
  suffix?: string;

  /** The number of places of decimal precision to include in the result. */
  precision: number;
}

export function formatSexagesimal(
  options: FormatSexagesimalOptions,
): string {
  let prefix = "";

  let value = options.value;
  if (value < 0) {
    value = -value;
    prefix = "-";
  } else if (options.showPlus) {
    prefix = "+";
  }

  const whole = Math.floor(value);
  value = (value - whole) * 60;
  const minutes = Math.floor(value);
  value = (value - minutes) * 60;
  const seconds = Math.floor(value);
  const remainder = value - seconds;

  const wText = String(whole).padStart(options.padWhole, '0');
  const mText = String(minutes).padStart(2, '0');
  const sText = String(seconds).padStart(2, '0');
  const rText = remainder.toFixed(options.precision).slice(1);  // drop the leading "0"
  const suffix = options.suffix ?? "";
  const sep1 = options.firstSeparator;
  const sep2 = options.secondSeparator;
  return `${prefix}${wText}${sep1}${mText}${sep2}${sText}${rText}${suffix}`
}

/** Format an angle, measured in radians, as sexagesimal hours.
 *
 * Before formatting, the angle is normalized to lie within 0-2pi.
 *
 * @param angleRad The angle in radians.
 * @param sep1 The text to put between the hours and the minutes. Defaults to
 * `":"`.
 * @param sep2 The text to put between the minutes and the seconds. Defaults to
 * `":"`.
 * @param precision The number of places of decimal precision to include in the
 * result. Defaults to 0.
 * @returns The formatted angle.
 */
export function fmtHours(angleRad: number, sep1 = ":", sep2 = ":", precision = 0, suffix = ""): string {
  return formatSexagesimal({
    value: angnorm(angleRad) * R2H,
    showPlus: false,
    padWhole: 2,
    firstSeparator: sep1,
    secondSeparator: sep2,
    precision,
    suffix,
  });
}

/** Format a latitudinal angle, measured in radians, as sexagesimal degrees.
 *
 * If the number is not in the range [-pi, pi], `" ??${sep1}??${sep2}??"` is
 * returned.
 *
 * @param angleRad The latitude in radians.
 * @param sep1 The text to put between the degrees and the arcminutes. Defaults
 * to `":"`.
 * @param sep2 The text to put between the arcminutes and the arcseconds.
 * Defaults to `":"`.
 * @param precision The number of places of decimal precision to include in the
 * result. Defaults to 0.
 * @returns The formatted angle.
 */
export function fmtDegLat(angleRad: number, sep1 = ":", sep2 = ":", precision = 0): string {
  if (angleRad < -PI || angleRad > PI)
    return ` ??${sep1}??${sep2}??`;

  return formatSexagesimal({
    value: angleRad * R2D,
    showPlus: true,
    padWhole: 2,
    firstSeparator: sep1,
    secondSeparator: sep2,
    precision,
  });
}

/** Format a longitudinal angle, measured in radians, as sexagesimal degrees.
 *
 * Before formatting, the angle is normalized to lie within 0-2pi. The output
 * will be zero-padded to three digits, e.g. `"000:01:30"` or `"359:59:59.123"`.
 *
 * @param angleRad The longitude in radians.
 * @param sep1 The text to put between the degrees and the arcminutes. Defaults
 * to `":"`.
 * @param sep2 The text to put between the arcminutes and the arcseconds.
 * Defaults to `":"`.
 * @param precision The number of places of decimal precision to include in the
 * result. Defaults to 0.
 * @returns The formatted angle.
 */
export function fmtDegLon(angleRad: number, sep1 = ":", sep2 = ":", precision = 0): string {
  return formatSexagesimal({
    value: angnorm(angleRad) * R2D,
    showPlus: false,
    padWhole: 3,
    firstSeparator: sep1,
    secondSeparator: sep2,
    precision,
  });
}

export function formatDecimalHours(dayFraction: number, sep = ":"): string {
  // Looks like a timezone correction?
  const ts = new Date(new Date().toUTCString()).valueOf() - new Date().valueOf();
  const hr = ts / (1000 * 60 * 60);
  let day = (dayFraction - hr);
  while (day > 24) {
    day -= 24;
  }
  while (day < 0) {
    day += 24;
  }

  const hours = Math.floor(day);
  const minutes = ((day * 60) - (hours * 60)).toFixed(0);
  return [hours, minutes].map(n => n.toString().padStart(2, '0')).join(sep);
}

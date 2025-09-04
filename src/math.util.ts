import { DEG_180, DEG_360 } from "./three.util";
import { Num3, Num4 } from "./types.util";

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const factorBetweenValues = (
  value: number,
  min: number,
  max: number
): number => (min === max ? value : (value - min) / (max - min));

export const factorInRange = (
  value: number,
  min: number,
  max: number
): number => clamp(factorBetweenValues(value, min, max), 0, 1);
// min === max ? value : clamp((value - min) / (max - min), 0, 1);

export const factorIn = (
  value: number,
  start: number = 0,
  end: number = 1
): number => factorInRange(value, start, end);

export const factorOut = (value: number, start: number = 0, end: number = 1) =>
  factorInRange(value, end, start);

export const factorInOut = (
  value: number,
  start: number = 0,
  mid: number = 0.5,
  end: number = 1
) => {
  return value > mid ? factorOut(value, mid, end) : factorIn(value, start, mid);
};

export const mix = (valueA: number, valueB: number, factor: number) =>
  valueA + (valueB - valueA) * factor;

export const mixNum3 = (valueA: Num3, valueB: Num3, factor: number): Num3 =>
  valueA.map((v, i) => mix(v, valueB[i]!, factor)) as Num3;
export const mixNum4 = (valueA: Num4, valueB: Num4, factor: number): Num4 =>
  valueA.map((v, i) => mix(v, valueB[i]!, factor)) as Num4;

export const addNum3 = (valueA: Num3, valueB: Num3): Num3 =>
  valueA.map((v, i) => v + valueB[i]!) as Num3;

export const subNum3 = (valueA: Num3, valueB: Num3): Num3 =>
  valueA.map((v, i) => v - valueB[i]!) as Num3;

export const mulNum3 = (valueA: Num3, valueB: Num3 | number): Num3 =>
  valueA.map(
    (v, i) => v * (typeof valueB === "number" ? valueB : valueB[i]!)
  ) as Num3;

export const divNum3 = (valueA: Num3, valueB: Num3 | number): Num3 =>
  valueA.map(
    (v, i) => v / (typeof valueB === "number" ? valueB : valueB[i]!)
  ) as Num3;

export const lengthNum3 = (value: Num3): number =>
  Math.sqrt(value.reduce((sum, v) => sum + v * v, 0));
export const distanceNum3 = (valueA: Num3, valueB: Num3): number =>
  lengthNum3(subNum3(valueA, valueB));

export const normaliseNum3 = (value: Num3): Num3 =>
  divNum3(value, lengthNum3(value));

export const num3AlongBezier = (
  p1: Num3,
  p2: Num3,
  p3: Num3,
  f: number
): Num3 => {
  return mixNum3(mixNum3(p1, p2, f), mixNum3(p2, p3, f), f);
};

export const num3AlongQuadratic = (
  p1: Num3,
  p2: Num3,
  p3: Num3,
  p4: Num3,
  f: number
): Num3 => {
  return mixNum3(mixNum3(p1, p2, f), mixNum3(p3, p4, f), f);
};

export const vecToNum3 = (value: { x: number; y: number; z: number }): Num3 => {
  return [value.x, value.y, value.z] as Num3;
};

export const num3ToVec = (value: Num3): { x: number; y: number; z: number } => {
  return { x: value[0]!, y: value[1]!, z: value[2]! };
};

export const vecToNum4 = (value: {
  x: number;
  y: number;
  z: number;
  w: number;
}): Num4 => {
  return [value.x, value.y, value.z, value.w] as Num4;
};

export const num4ToVec = (
  value: Num4
): { x: number; y: number; z: number; w: number } => {
  return { x: value[0]!, y: value[1]!, z: value[2]!, w: value[3]! };
};

export const num3ToAngleY = (from: Num3, to: Num3): number => {
  return Math.atan2(to[0] - from[0], to[2] - from[2]);
};

export const readNum3 = (value: Num3 | (() => Num3)): Num3 => {
  return typeof value === "function" ? value() : value;
};

export const quantize = (value: number, step: number) =>
  Math.round(value / step) * step;

export const modulus = (value: number, mod: number) => {
  if (value < 0) value = mod - (Math.abs(value) % mod);

  return value % mod;
};

export const normaliseAngle = (value: number) =>
  modulus(value + DEG_180, DEG_360) - DEG_180;

export const lerp = mix;

export const normaliseCosine = (value: number) => factorIn(value, -1, 1);

export function formatDuration(seconds: number): string {
  const units = [
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (let unit of units) {
    if (seconds >= unit.seconds) {
      const value = Math.floor(seconds / unit.seconds);
      return value + unit.label + (value > 1 ? "s" : "");
    }
  }

  return "0secs"; // in case the duration is zero
}

export function normaliseIndex(index: number, numItems: number) {
  if (index < 0) index = numItems - (Math.abs(index) % numItems);

  return index % numItems;
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function modArrayIndex(index: number, length: number) {
  if (index < 0) index = length - (Math.abs(index) % length);

  return index % length;
}

export function sign(value: number) {
  return value < 0 ? -1 : 1;
}

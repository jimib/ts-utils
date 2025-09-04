"use client";

// Conditional imports with fallbacks
let useTexture: any = null;
let useFrame: any = null;
let MappedTextureType: any = null;
let ThreeElements: any = null;
let RootState: any = null;

try {
  const drei = require("@react-three/drei");
  const fiber = require("@react-three/fiber");
  const three = require("three");

  useTexture = drei.useTexture;
  useFrame = fiber.useFrame;
  MappedTextureType = drei.MappedTextureType;
  ThreeElements = fiber.ThreeElements;
  RootState = fiber.RootState;
} catch (e) {
  // Three.js dependencies not available - will be handled gracefully
  console.warn("@jimib/ts-utils: Three.js dependencies not found");
}

import each from "lodash-es/each";
import every from "lodash-es/every";
import isArray from "lodash-es/isArray";
import isFunction from "lodash-es/isFunction";
import isNumber from "lodash-es/isNumber";
import set from "lodash-es/set";
import size from "lodash-es/size";
import { ReactNode, useMemo } from "react";

// Only import Three.js types if available
let BufferGeometry: any = null;
let CanvasTexture: any = null;
let Color: any = null;
let Euler: any = null;
let Group: any = null;
let Object3D: any = null;
let Object3DEventMap: any = null;
let Scene: any = null;
let Vector3: any = null;

try {
  const three = require("three");
  BufferGeometry = three.BufferGeometry;
  CanvasTexture = three.CanvasTexture;
  Color = three.Color;
  Euler = three.Euler;
  Group = three.Group;
  Object3D = three.Object3D;
  Object3DEventMap = three.Object3DEventMap;
  Scene = three.Scene;
  Vector3 = three.Vector3;
} catch (e) {
  // Three.js not available
}

import {
  VeryWeakEuler,
  VeryWeakScale,
  VeryWeakVector3,
  WeakColor,
} from "./types.three.util";
import { Num3, Num4 } from "./types.util";

// Type definitions with fallbacks
export type GroupProps = any;
export type MeshProps = any;

export const toVector3 = (val: any) => {
  if (!val || !Vector3) {
    return val;
  }

  if (isArray(val)) {
    return new Vector3(...val);
  } else if (!val.isVector3) {
    return new Vector3().copy(val);
  }

  return val;
};

export function translate(
  position: Num3 | any,
  offset: Num3 = [0, 0, 0]
): Num3 | any {
  if (Array.isArray(position)) {
    return position.map((item, i) => item + (offset[i] ?? 0)) as Num3;
  }
  if (position && position.clone && position.add && Vector3) {
    return position.clone().add(new Vector3(...offset));
  }

  return position;
}

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export const DEG_30 = degToRad(30);
export const DEG_45 = degToRad(45);
export const DEG_60 = degToRad(60);
export const DEG_90 = degToRad(90);
export const DEG_120 = degToRad(120);
export const DEG_135 = degToRad(135);
export const DEG_150 = degToRad(150);
export const DEG_180 = degToRad(180);
export const DEG_210 = degToRad(210);
export const DEG_225 = degToRad(225);
export const DEG_240 = degToRad(240);
export const DEG_270 = degToRad(270);
export const DEG_300 = degToRad(300);
export const DEG_315 = degToRad(315);
export const DEG_330 = degToRad(330);
export const DEG_360 = degToRad(360);

export const DEG = degToRad;

export const applyVisibilityTo3dObject = (target: any, visible: boolean) => {
  if (!target) return;
  target.visible = visible;
};

export const applyPositionTo3dObject = (target: any, position: any) => {
  if (!target || !position) return;
  if (target.position && target.position.copy && toVector3) {
    target.position.copy(toVector3(position));
  }
};

export const applyRotationTo3dObject = (target: any, rotation: any) => {
  if (!target || !rotation) return;

  rotation = toVector3(rotation);

  if (target.rotation) {
    target.rotation.x = rotation.x;
    target.rotation.y = rotation.y;
    target.rotation.z = rotation.z;
  }
};

export const applyScaleTo3dObject = (target: any, scale: any) => {
  if (!target) return;

  if (isNumber(scale)) {
    if (target.scale && target.scale.set) {
      target.scale.set(scale, scale, scale);
    }
  } else if (isArray(scale) && size(scale) == 3 && every(scale, isNumber)) {
    if (target.scale && target.scale.set) {
      target.scale.set(...scale);
    }
  }
};

export const applyOpacityTo3dMaterial = (target: any, value: number) => {
  if (!target || !isNumber(value)) return;

  target.opacity = value;
};

export const applyPropsTo3dScene = (scene: any, config: any) => {
  each(config, (props, id) => {
    var item = scene.getObjectByName(id);

    if (item) {
      each(props, (value, iid) => {
        if (isFunction(value)) {
          value(item, id, iid);
        } else {
          set(item as any, iid, value);
        }
      });
    }
  });
};

interface TextureLoaderProps<T extends string | string[]> {
  url: T;
  render: (texture: any) => ReactNode;
}

export function TextureLoader<T extends string | string[]>({
  url,
  render,
}: TextureLoaderProps<T>): ReactNode {
  if (!useTexture) {
    console.warn("@jimib/ts-utils: useTexture not available");
    return null;
  }

  const texture = useTexture(url);
  return render(texture);
}

export function weakVector3ToVector3(value: VeryWeakVector3): any {
  if (!Vector3) return value;

  if (value instanceof Vector3) {
    return value;
  }
  if (value instanceof Array) {
    return new Vector3(...value);
  }

  return new Vector3(value.x ?? 0, value.y ?? 0, value.z ?? 0);
}

export function weakVector3ToArray(value: VeryWeakVector3): Num3 {
  if (value instanceof Array) {
    return value as Num3;
  }
  if (value && typeof value === "object" && "toArray" in value) {
    return value.toArray();
  }

  return [value.x ?? 0, value.y ?? 0, value.z ?? 0] as Num3;
}

export function weakEulerToEuler(value: VeryWeakEuler): any {
  if (!Euler) return value;

  if (typeof value === "number") {
    return new Euler(value, value, value);
  }
  if (value instanceof Euler) {
    return value;
  }
  if (value instanceof Array) {
    return new Euler(...(value as Num3));
  }

  return new Euler(value.x ?? 0, value.y ?? 0, value.z ?? 0);
}

export function weakEulerToArray(value: VeryWeakEuler): Num3 {
  if (typeof value === "number") {
    return [value, value, value];
  }
  if (value && typeof value === "object" && "toArray" in value) {
    return value.toArray().slice(0, 3) as Num3;
  }
  if (value instanceof Array) {
    return value.slice(0, 3) as Num3;
  }

  return [value.x ?? 0, value.y ?? 0, value.z ?? 0] as Num3;
}

export function weakScaleToVector3(value: VeryWeakScale): any {
  if (!Vector3) return value;

  if (value instanceof Vector3) {
    return value;
  }
  if (value instanceof Array) {
    return new Vector3(...value);
  }
  if (typeof value === "number") {
    return new Vector3(value, value, value);
  }

  return new Vector3(value.x ?? 0, value.y ?? 0, value.z ?? 0);
}

export function weakScaleToArray(value: VeryWeakScale): Num3 {
  if (value instanceof Array) {
    return value as Num3;
  }
  if (value && typeof value === "object" && "toArray" in value) {
    return value.toArray();
  }
  if (typeof value === "number") {
    return [value, value, value];
  }

  return [value.x ?? 0, value.y ?? 0, value.z ?? 0] as Num3;
}

export function weakColorToColor(value: WeakColor): any {
  if (!Color) return value;

  if (value instanceof Color) {
    return value;
  }

  if (Array.isArray(value)) {
    return new Color(...value);
  }

  if (typeof value === "string") {
    const colorInteger = parseInt(value, 16);

    if (colorInteger || colorInteger === 0) {
      return new Color(splitColorIntegerByOpacity(colorInteger).rgb);
    }
  }

  return new Color(value);
}

export function weakColorToArray(value: WeakColor): Num4 {
  if (value instanceof Array) {
    return [...value, 1] as Num4;
  }
  if (value && typeof value === "object" && "toArray" in value) {
    return [...value.toArray(), 1] as Num4;
  }

  if (typeof value === "string") {
    const colorInteger = parseInt(value, 16);

    if (colorInteger || colorInteger === 0) {
      const { rgb, opacity } = splitColorIntegerByOpacity(colorInteger);
      return [...new Color(rgb).toArray(), opacity] as Num4;
    }

    return [...new Color(value).toArray(), 1] as Num4;
  }

  if (typeof value === "number") {
    const { rgb, opacity } = splitColorIntegerByOpacity(value);
    return [...new Color(rgb).toArray(), opacity] as Num4;
  }

  return [...new Color(value).toArray(), 1] as Num4;
}

export function findWeakColorOpacity(value: WeakColor): number {
  if (typeof value === "string") {
    const colorInteger = parseInt(value, 16);

    if (colorInteger || colorInteger === 0) {
      return getOpacityFromColorInteger(colorInteger);
    }
  }

  if (typeof value === "number") {
    return getOpacityFromColorInteger(value);
  }

  return 1;
}

export function getOpacityFromColorInteger(color: number): number {
  if (color <= 0xffffff) {
    return 1.0;
  }

  const alphaByte = (color & 0xff) >>> 0;
  return alphaByte / 255;
}

export function splitColorInteger(
  color: number
): [r: number, g: number, b: number, a: number] {
  const hasAlpha = color > 0xffffff;

  const r = (color >>> (hasAlpha ? 24 : 16)) & 0xff;
  const g = (color >>> (hasAlpha ? 16 : 8)) & 0xff;
  const b = (color >>> (hasAlpha ? 8 : 0)) & 0xff;
  const a = hasAlpha ? color & 0xff : 0xff;

  return [r, g, b, a / 255];
}

export function splitColorIntegerByOpacity(color: number): {
  rgb: number;
  opacity: number;
} {
  const hasAlpha = color > 0xffffff;

  const rgbValue = hasAlpha ? color >>> 8 : color;
  const alpha = hasAlpha ? color & 0xff : 0xff;

  return {
    rgb: rgbValue,
    opacity: alpha / 255,
  };
}

export function useTextureSection(src: string, region: Num4) {
  if (!useTexture || !CanvasTexture) {
    console.warn("@jimib/ts-utils: useTexture or CanvasTexture not available");
    return null;
  }

  const textureInput = useTexture(src);

  const textureOutput = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = textureInput.image.width;
    canvas.height = textureInput.image.height;
    return new CanvasTexture(canvas);
  }, [textureInput]);

  useMemo(() => {
    const [ileft, itop, iright, ibottom] = region;

    const left = ileft * textureInput.image.width;
    const top = itop * textureInput.image.height;
    const right = iright * textureInput.image.width;
    const bottom = ibottom * textureInput.image.height;

    const canvas = textureOutput.image;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      textureInput.image,
      left,
      top,
      right - left,
      bottom - top,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [textureInput, region]);

  return textureOutput;
}

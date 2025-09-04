// Make Three.js imports optional
let ReactThreeFiber: any = null;
let HSL: any = null;
let RGB: any = null;
let Vector3Like: any = null;

try {
  const fiber = require("@react-three/fiber");
  const three = require("three");
  ReactThreeFiber = fiber.ReactThreeFiber;
  HSL = three.HSL;
  RGB = three.RGB;
  Vector3Like = three.Vector3Like;
} catch (e) {
  // Three.js dependencies not available
  console.warn("@jimib/ts-utils: Three.js dependencies not found");
}

export type WeakColor = any;
export type WeakEuler = any;
export type WeakScale = any;
export type WeakVector3 = any;

export type VeryWeakColor = WeakColor | Partial<any>;
export type VeryWeakEuler = WeakEuler | Partial<any>;
export type VeryWeakScale = WeakScale | Partial<any>;
export type VeryWeakVector3 = WeakVector3 | Partial<any>;

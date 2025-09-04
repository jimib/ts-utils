import { ReactThreeFiber } from "@react-three/fiber";
import { HSL, RGB, Vector3Like } from "three";
export type WeakColor = ReactThreeFiber.Color;
export type WeakEuler = ReactThreeFiber.Euler;
export type WeakScale = ReactThreeFiber.Vector3;
export type WeakVector3 = ReactThreeFiber.Vector3 extends infer U | number ? U : never;

export type VeryWeakColor = WeakColor | Partial<HSL | RGB>;
export type VeryWeakEuler = WeakEuler | Partial<Vector3Like>;
export type VeryWeakScale = WeakScale | Partial<Vector3Like>;
export type VeryWeakVector3 = WeakVector3 | Partial<Vector3Like>;

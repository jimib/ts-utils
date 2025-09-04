export type Primitive = string | number | bigint | boolean | null | undefined;
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Arr2<T> = [T, T];
export type Arr3<T> = [T, T, T];
export type Arr4<T> = [T, T, T, T];

export type Num2 = Arr2<number>;
export type Num3 = Arr3<number>;
export type Num4 = Arr4<number>;

/**
 * @summary Use to create a fixed length array. This can create arrays of up to `9999` elements.
 * @description If the length is the literla type `number`, OR the length is not a digit or a digit string (i.e. not an integer between
 * `0` and `9999`, or a stringified integer between `0` and `9999`), then the array will be of type `U[]`.
 *
 *
 * `9999` is the current maximum length of tuple types in TypeScript. Attempting to create an array / tuple with a length
 * greater than `9999` will result in a compile error.
 * ---
 * ## Edge Cases
 * - The input string to {@linkcode L} can contain `0` padding, as long as the length of the string `<= 4`.
 *   For example, `"3"`, `"03"`, `"003"`, and `"0003"` are valid, but `"00003"` is not since it is longer than `4` characters.
 * - The input string to {@linkcode L} can NOT contain any characters other than `0` through to `9`.
 * - If the input number is negative, the array will be of type `U[]`.
 * - If {@linkcode L} is invalid, the array will be of type `U[]`.
 * - If {@linkcode L} is a union type (i.e. of the form `A | B | ...`, then this will return a union type
 *   of each value in {@linkcode L} if valid. Any values in the union that are invalid (i.e. values that would result in
 *   `U[]` being returned) will be stripped out.
 *   - For example, `Arr<A, 1 | 2>` will return `[A] | [A, A]`.
 *   - `Arr<A, 1 | "asd">` will return `[A]`, instead of `[A] | A[]`, due to the invalid `"asd"` union getting stripped out.
 * - Also note that if the first argument is a union type, this does not multiply the amount of results.
 *   For example, `Arr<A | B>` will return `[A | B]` instead of `[A] | [B]`,
 *   and `Arr<A | B, 1 | 2>` will return `[A | B] | [A | B, A | B]`, etc.
 * - There is no invalid value for the first type parameter, {@linkcode U}.
 * ---
 * ## Remarks
 * - This internally builds up the array by joining together multiple smaller arrays.
 *
 * @example
 * type Q = Arr<string, 2>; // [number, number]
 * type R = Arr<string, 3>; // [number, number, number]
 * type S = Arr<string, "3">; // [number, number, number]
 * type V = Arr<string | boolean, 2>; // [string | boolean, string | boolean]
 * type W = Arr<string, number>; // string[]
 * type X = Arr<string, 10000, string>; // string[], since the maxmimum length is `9999`
 *
 * const LENGTH = 5;
 * type Array = Arr<string, typeof LENGTH>;  // [string, string, string, string, string]
 * @endexample
 * &nbsp;
 * ---
 * @template U - The type of the elements in the array.
 * @template L - The length of the array. Can range from `0` to `9999`. This can be a `number` or a `string` that represents a number.
 * If it is a `string`, it must be a 1-4 digit string of numbers. Note: it is not possible to create an array
 * with a length greater than `9999`.
 *
 * If L is actually the type `number`, then this will return `U[]`.
 * @template T - Optional type to be spread into the array. In 90% of cases, this shouldn't be provided.
 * Defaults to `[U]`.
 * ---
 * @since 0.0.0
 * @version 1.6.0
 * @see
 * - {@linkcode Digit} - A type representing a single digit from `0` to `9`.
 * - {@linkcode Num2}, {@linkcode Num3}, {@linkcode Num4} - Types representing number arrays of length `2`, `3`, and `4`, respectively.
 * - {@linkcode FixedArr} - A type representing a fixed length array.
 * - {@linkcode ArrLength} - A type that returns the length of an array, or the literal type `number` if the array is of unknown length.
 *
 */
export type Arr<U, L extends Primitive, T extends FixedArr<U> = [U]> =
	`${L}` extends (
		`${infer _1}${infer _2}` // We could use `${infer _1 extends Digit}`, etc, but this is more efficient
	) ?
		_1 extends `${Digit}` ?
			_2 extends "" ?
				[
					// 0-9 elements
					...ArrSmall<U, _1, T>,
				]
			: _2 extends `${Digit}` ?
				[
					// 10-99 elements
					...Arr10<U, ArrSmall<U, _1, T>>,
					...ArrSmall<U, _2, T>,
				]
			: `${L}` extends `${infer _1}${infer _2}${infer _3}${infer _4}` ?
				_1 extends `${Digit}` ?
					_2 extends `${Digit}` ?
						_3 extends `${Digit}` ?
							_4 extends "" ?
								[
									// 100-999 elements
									...Arr100<U, ArrSmall<U, _1, T>>,
									...Arr10<U, ArrSmall<U, _2, T>>,
									...ArrSmall<U, _3, T>,
								]
							: _4 extends `${Digit}` ?
								[
									// 1000-9999 elements
									...Arr1000<U, ArrSmall<U, _1, T>>,
									...Arr100<U, ArrSmall<U, _2, T>>,
									...Arr10<U, ArrSmall<U, _3, T>>,
									...ArrSmall<U, _4, T>,
								]
							:	U[] // >= 1000 elements, or invalid input
						:	never
					:	never
				:	never
			:	never
		:	never
	:	never;

type ArrSmall<U, L extends Digit | `${Digit}`, T extends FixedArr = [U]> = [
	[], //                                                     1
	[...T], //                                                 2
	[...T, ...T], //                                           3
	[...T, ...T, ...T], //                                     4
	[...T, ...T, ...T, ...T], //                               5
	[...T, ...T, ...T, ...T, ...T], //                         6
	[...T, ...T, ...T, ...T, ...T, ...T], //                   7
	[...T, ...T, ...T, ...T, ...T, ...T, ...T], //             8
	[...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T], //       9
	[...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T], // 10
][L];
type Arr10<U, T extends FixedArr = [U]> = [
	...T, // 1
	...T, // 2
	...T, // 3
	...T, // 4
	...T, // 5
	...T, // 6
	...T, // 7
	...T, // 8
	...T, // 9
	...T, // 10
];
type Arr100<U, T extends FixedArr = [U]> = Arr10<U, Arr10<U, T>>;
type Arr1000<U, T extends FixedArr = [U]> = Arr100<U, Arr10<U, T>>;

export type FixedArr<T = unknown> = T[];

/**
 * @summary Accurately represents {@linkcode NumberConstants.NAN NaN}, {@linkcode NumberConstants.INFINITY Infinity},
 * and {@linkcode NumberConstants.NEGATIVE_INFINITY -Infinity} values.
 * @description Note that these are only accessible via a enum, since {@linkcode NaN}
 * and {@linkcode Infinity} are both typed as {@linkcode number}, and so using `typeof NaN` or `typeof Infinity` will return `number`,
 * instead of the actual value as desired.
 * ---
 * ## Motivation
 *
 * The following:
 * ```ts
 * type e = NaN;
 * ```
 *
 * is disallowed in TypeScript, and gives the following error:
 * `'NaN' refers to a value, but is being used as a type here. Did you mean 'typeof NaN'?`
 *
 * ---
 *
 * However, when using
 *
 * ```ts
 * type e = typeof NaN;
 * ```
 *
 * ...the type `e` is actually the type `number`, not `NaN`,
 * since the built-in constant `NaN` is {@link NaN declared as a `number`}!
 *
 * ---
 *
 * Using an enum is the only way to actually obtain the value `NaN` **_as a type_**.
 * The same applies to `Infinity` and `-Infinity`.
 *
 * ---
 *
 * Note that these values are **_not inlined_**, so will show up as `NumberConstants.NAN` instead of `NaN`
 * even though they both represent the same value.
 *
 * ---
 * @since v0.0.0
 * @version 1.0.0
 * @see
 * - [NaN - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/NaN)
 * - [Infinity - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/Infinity)
 * - [Negative Infinity - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/Negative_infinity)
 */
export enum NumberConstants {
	/** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
	E = 2.718281828459045,

	INFINITY = Infinity,

	/** The natural logarithm of 10. */
	LN10 = 2.302585092994046,

	/** The natural logarithm of 2. */
	LN2 = 0.6931471805599453,

	/** The base-2 logarithm of e. */
	LOG2E = 1.4426950408889634,

	/** The base-10 logarithm of e. */
	LOG10E = 0.4342944819032518,
	NAN = NaN,
	NEGATIVE_INFINITY = -Infinity,

	/** Pi. This is the ratio of the circumference of a circle to its diameter. */
	PI = 3.141592653589793,

	/** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
	SQRT1_2 = 0.7071067811865476,

	/** The square root of 2. */
	SQRT2 = 1.4142135623730951,
}
/**
 * @summary Accurate repesentation of all falsy values.
 * @description
 * __From the MDN Web Docs:__
 * >
 * > The following table provides a complete list of JavaScript falsy values:
 * Value  | Type  | Description
 * -|-|-
 * [`null`](https://developer.mozilla.org/docs/Glossary/Null)                 | `Null`              | The keyword `null` — the absence of any value.
 * [`undefined`](https://developer.mozilla.org/docs/Glossary/Undefined)       | `Undefined`         | {@linkcode undefined} — the primitive value.
 * `false`                                                                    | {@linkcode Boolean} | The keyword [`false`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words).
 * [`NaN`](https://developer.mozilla.org/docs/Glossary/NaN)                   | {@linkcode Number}  | [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) — not a number.
 * `0`                                                                        | {@linkcode Number}  | The {@linkcode Number} zero, also including `0.0`, `0x0`, etc.
 * `-0`                                                                       | {@linkcode Number}  | The {@linkcode Number} negative zero, also including `-0.0`, `-0x0`, etc.
 * `0n`                                                                       | {@linkcode BigInt}  | The {@linkcode BigInt} zero, also including `0x0n`, etc. Note that there is no `BigInt` negative zero — the negation of `0n` is `0n`.
 * `""`                                                                       | {@linkcode String}  | Empty string value, also including `''` and ``.
 * [`document.all`](https://developer.mozilla.org/docs/Web/API/Document/all)  | {@linkcode Object}  | The only falsy object in JavaScript is the built-in {@linkcode document.all}.
 *
 * The `Falsy` type is a union of ALL the above falsy values, including `NaN` and `document.all`.
 * ---
 * @since v0.0.0
 * @version 1.0.0
 * @see
 * - [Falsy - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/Falsy)
 * - [Null - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/Null)
 * - [Undefined - MDN Web Docs](https://developer.mozilla.org/docs/Glossary/Undefined)
 * - [`document.all` - MDN Web Docs](https://developer.mozilla.org/docs/Web/API/Document/all)
 * - {@linkcode NumberConstants} - Accurately represents {@linkcode NumberConstants.NAN NaN}, {@linkcode NumberConstants.INFINITY Infinity},
 * and {@linkcode NumberConstants.NEGATIVE_INFINITY -Infinity} values. Note that these are only accessible via a enum, since {@linkcode NaN}
 * and {@linkcode Infinity} are both typed as {@linkcode number}, and so using `typeof NaN` or `typeof Infinity` will return `number`,
 * instead of the actual value as desired.
 */
export type Falsy = null | undefined | false | NumberConstants.NAN | 0 | -0 | 0n | "" | HTMLAllCollection;

export const nullify = <T>(): T | null => null;
export const undefine = <T>(): T | undefined => undefined;

/**
 * @summary Represents a value ({@linkcode T}) or a {@linkcode Function} that returns a value (`() =>`{@linkcode T}).
 */
export type MaybeFunc<T> = T | (() => T);

export const voider = () => {};
export const undefiner = () => undefined;
export const nuller = () => null;
export const falser = () => false;
export const truer = () => true;
export const naner = () => NaN;
export const niller = () => 0;

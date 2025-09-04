import { MaybeFunc } from "./types.util";

/**
 * @summary Checks if the provided {@linkcode value} is a function, and if so, invokes it. Otherwise, returns the value as-is.
 * @template T - The type of the value to be checked.
 *
 * ---
 *
 * **See also:**
 * @see {@linkcode MaybeFunc<T>} - A type representing a value ({@linkcode T}) or a {@linkcode Function} that returns a value (`() =>`{@linkcode T}).
 */
export function maybeInvoke<T>(value: MaybeFunc<T>): T {
	if (value instanceof Function) {
		return value();
	}

	return value;
}

/** Invokes the given function. The same as calling {@linkcode value()}. */
export const invoke = <T>(value: () => T) => value();

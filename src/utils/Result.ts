/**
 * Represents a computation that can fail.
 *
 * Makes it possible to use type checking on the error type,
 * which is not possible when using a throw statement
 */
export type Result<E, V> = Success<V> | Failure<E>

export type Success<V> = { success: true; value: V }

export type Failure<E> = { success: false; error: E }

export const success = <V>(value: V): Success<V> => ({ success: true, value })

export const failure = <E>(error: E): Failure<E> => ({ success: false, error })

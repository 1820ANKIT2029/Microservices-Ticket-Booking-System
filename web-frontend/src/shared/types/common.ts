/**
 * Common utility types used across all features.
 */

/** A value that can be either string or number — matches backend ID conventions */
export type ID = string | number;

/** A value that can be null */
export type Nullable<T> = T | null;

/** A value that can be undefined */
export type Optional<T> = T | undefined;

/** A partial record with specific string keys */
export type PartialRecord<K extends string, V> = Partial<Record<K, V>>;

/** Timestamp string in ISO 8601 format */
export type ISODateString = string;

/** Generic key-value pair */
export type KeyValuePair<K extends string = string, V = unknown> = {
  key: K;
  value: V;
};

/** Makes specific keys required on a type */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Makes specific keys optional on a type */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

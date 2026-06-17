/**
 * shared/types — barrel export.
 *
 * Import from "@/shared/types" instead of deep-importing individual files.
 */
export type {
  ApiResponse,
  ApiErrorResponse,
  PageResponse,
  PagedRequest,
  SortRequest,
} from "./api";

export type {
  ID,
  Nullable,
  Optional,
  PartialRecord,
  ISODateString,
  KeyValuePair,
  RequireFields,
  PartialBy,
} from "./common";

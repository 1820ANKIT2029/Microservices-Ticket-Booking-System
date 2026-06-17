import { z } from "zod";

/**
 * Shared Zod primitives.
 * Compose these in feature-level schemas rather than repeating the same regex.
 */

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{7,15}$/, "Please enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

export const nonEmptyString = z
  .string()
  .min(1, "This field is required")
  .trim();

export const positiveInt = z
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than 0");

export const nonNegativeNumber = z
  .number()
  .min(0, "Must be 0 or greater");

export const idSchema = z.union([z.string(), z.number()]);

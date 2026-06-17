import { z } from "zod";
import { nonEmptyString, urlSchema, positiveInt } from "@/shared/validators";
import { EVENT_STATUS, EVENT_TYPE } from "@/shared/constants";

export const eventRequestSchema = z.object({
  title:          nonEmptyString.max(200, "Title must be at most 200 characters"),
  slug:           nonEmptyString.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description:    z.string().max(2000).optional(),
  eventType:      z.nativeEnum(EVENT_TYPE).optional(),
  minAge:         z.number().int().min(0).optional(),
  venueId:        positiveInt,
  bannerUrl:      urlSchema,
  posterUrl:      urlSchema,
  isMultiSession: z.boolean().optional(),
  isFeatured:     z.boolean().optional(),
});

export type EventRequestFormData = z.infer<typeof eventRequestSchema>;

import { z } from "zod";
import { nonEmptyString, urlSchema, positiveInt } from "@/shared/validators";

export const venueRequestSchema = z.object({
  name:          nonEmptyString.max(100, "Name must be at most 100 characters"),
  description:   z.string().max(1000).optional(),
  addressLine1:  nonEmptyString.max(255),
  city:          nonEmptyString.max(100),
  state:         nonEmptyString.max(100),
  country:       nonEmptyString.max(100),
  postalCode:    nonEmptyString.max(20),
  longitude:     z.number().min(-180).max(180).optional(),
  latitude:      z.number().min(-90).max(90).optional(),
  timezone:      nonEmptyString,
  totalCapacity: positiveInt.optional(),
  websiteUrl:    urlSchema,
  svgTemplateUrl: urlSchema,
  amenities:     z.string().max(500).optional(),
});

export type VenueRequestFormData = z.infer<typeof venueRequestSchema>;

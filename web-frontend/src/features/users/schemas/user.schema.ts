import { z } from "zod";
import {
  emailSchema,
  phoneSchema,
  nonEmptyString,
  urlSchema,
} from "@/shared/validators";

export const updateProfileSchema = z.object({
  firstName:   nonEmptyString.max(64, "First name must be at most 64 characters"),
  lastName:    nonEmptyString.max(64, "Last name must be at most 64 characters"),
  email:       emailSchema,
  phoneNumber: phoneSchema,
  avatarUrl:   urlSchema,
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

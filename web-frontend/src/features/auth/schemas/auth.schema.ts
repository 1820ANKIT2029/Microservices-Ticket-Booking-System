import { z } from "zod";
import { emailSchema, passwordSchema, phoneSchema, nonEmptyString } from "@/shared/validators";
import { USER_ROLE } from "@/shared/constants";

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email:       emailSchema,
  password:    passwordSchema,
  firstName:   nonEmptyString.max(64),
  lastName:    nonEmptyString.max(64),
  phoneNumber: phoneSchema ?? z.string(),
  role:        z.nativeEnum(USER_ROLE).default("CONSUMER"),
});

export const profileCreationSchema = z.object({
  firstName:   nonEmptyString.max(64),
  lastName:    nonEmptyString.max(64),
  email:       emailSchema,
  phoneNumber: z.string().optional().or(z.literal("")),
  avatarUrl:   z.string().optional().or(z.literal("")),
});

export type LoginFormData          = z.infer<typeof loginSchema>;
export type SignupFormData          = z.infer<typeof signupSchema>;
export type ProfileCreationFormData = z.infer<typeof profileCreationSchema>;

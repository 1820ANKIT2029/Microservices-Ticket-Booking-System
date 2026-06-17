/**
 * Users feature — public API.
 * Import from "@/features/users" — never deep-import individual files.
 */

// Service
export { UserService } from "./api/service";

// Hooks
export { useUser }          from "./hooks/useUser";
export { useUsers }         from "./hooks/useUsers";
export { useUpdateProfile } from "./hooks/useUpdateProfile";

// Types
export type {
  UserResponseDto,
  UserRequestDto,
  User,
  UserProfileData,       // @deprecated — prefer User
  SecuritySettings,
  NotificationPreferences,
  SavedCard,
} from "./types";

// Mapper
export { toUser, toUserList, toUserProfileData } from "./mapper";

// Query keys
export { userKeys } from "./query-keys";

// Schemas
export { updateProfileSchema } from "./schemas/user.schema";
export type { UpdateProfileFormData } from "./schemas/user.schema";

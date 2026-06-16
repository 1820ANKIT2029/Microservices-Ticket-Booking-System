// Users feature public API — canonical home for user/profile types
export { UserService } from "./services/user.service";
export { useUser } from "./hooks/queries/useUser";
export { useUpdateProfile } from "./hooks/mutations/useUpdateProfile";
export type {
  UserProfileData,
  SecuritySettings,
  NotificationPreferences,
  SavedCard,
  UserResponseDto,
  UserRequestDto,
} from "./types/profile";

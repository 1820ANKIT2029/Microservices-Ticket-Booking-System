import type { UserResponseDto, User, UserProfileData } from "./types";

/**
 * Maps a backend UserResponseDto to the frontend User domain model.
 * Supports both camelCase and snake_case field names from the backend.
 */
export function toUser(dto: UserResponseDto): User {
  return {
    id:        dto.userId ?? "",
    firstName: dto.firstName ?? "",
    lastName:  dto.lastName ?? "",
    fullName:  `${dto.firstName ?? ""} ${dto.lastName ?? ""}`.trim(),
    email:     dto.email ?? "",
    phoneNumber: dto.phoneNumber || "",
    avatarUrl: dto.avatarUrl ?? "",
    role:      dto.role ?? "CONSUMER",
  };
}

/**
 * Maps an array of UserResponseDto to an array of User domain models.
 */
export function toUserList(dtos: UserResponseDto[]): User[] {
  return dtos.map(toUser);
}

/**
 * Maps a User domain model back to UserProfileData for legacy components.
 * @deprecated Use the User domain model directly in new components.
 */
export function toUserProfileData(user: User): UserProfileData {
  return {
    userId:      user.id,
    firstName:   user.firstName,
    lastName:    user.lastName,
    email:       user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl:   user.avatarUrl,
  };
}

/**
 * Maps a raw backend DTO (possibly snake_case) to UserProfileData.
 * Used during migration for legacy profile components.
 * @deprecated Use toUser() + UserProfileData adapter instead.
 */
export function rawDtoToProfileData(raw: Record<string, unknown>): UserProfileData {
  return {
    userId:      (raw.userId || raw.user_id) as string | undefined,
    firstName:   (raw.firstName || raw.first_name || "") as string,
    lastName:    (raw.lastName || raw.last_name || "") as string,
    email:       (raw.email || "") as string,
    phoneNumber: (raw.phoneNumber || raw.phone_number || "") as string,
    avatarUrl:   (raw.avatarUrl || raw.avatar_url || "") as string,
  };
}

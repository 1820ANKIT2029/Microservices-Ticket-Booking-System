export interface UserModel {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getFullName = (u: UserModel) => `${u.firstName} ${u.lastName}`.trim();
export const isAdminUser = (u: UserModel) => u.role === "ADMIN";

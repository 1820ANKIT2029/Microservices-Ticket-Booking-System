export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "CONSUMER" | "ORGANIZER" | "ADMIN";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  firstLogin: boolean;
}

export interface ProfileCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

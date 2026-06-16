// Auth feature public API
export { AuthService } from "./services/auth.service";
export type { SignupPayload, LoginPayload, LoginResponse, ProfileCreationRequest } from "./types/auth";
// Components are internal to routes; export only if needed cross-feature

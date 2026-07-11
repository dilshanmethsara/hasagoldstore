import { http } from "@/api/httpClient";
import type { Profile, User } from "@/types";
import type { ProfileUpdateInput, CompleteProfileInput } from "@/validation";

export const userService = {
  me: () => http.get<User>("/users/me"),
  profile: () => http.get<Profile>("/users/me/profile"),
  updateProfile: (input: ProfileUpdateInput) =>
    http.patch<Profile>("/users/me/profile", input),
  completeProfile: (input: CompleteProfileInput) =>
    http.post<Profile>("/users/me/profile/complete", input),
};

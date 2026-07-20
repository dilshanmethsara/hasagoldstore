export function serializeProfile(profile: any) {
  if (!profile) return null;

  return {
    id: profile.id,
    user_id: profile.userId,
    display_name: profile.displayName ?? null,
    username: profile.username ?? null,
    avatar_url: profile.avatarUrl ?? null,
    phone: profile.phone ?? null,
    country: profile.country ?? null,
    status: profile.status,
    status_reason: profile.statusReason ?? null,
    status_updated_at: profile.statusUpdatedAt ?? null,
    created_at: profile.createdAt,
  };
}

export function serializeUser(user: any, profile?: any) {
  return {
    id: user.id,
    email: user.email,
    email_verified: user.emailVerified,
    phone: user.phone ?? null,
    phone_verified: user.phoneVerified,
    phone_verified_at: user.phoneVerifiedAt ?? null,
    roles: user.roles,
    status: user.status,
    created_at: user.createdAt,
    profile: profile ? serializeProfile(profile) : null,
  };
}

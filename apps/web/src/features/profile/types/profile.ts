export interface UserProfile {
  id: string;
  fullName: string;
  publicAlias: string;
  avatarPath: string;
  avatarUrl: string;
  municipality: string;
  bio: string;
  isPublic: boolean;
  publicShowAvatar: boolean;
  publicShowMunicipality: boolean;
  createdAt: string;
  updatedAt: string;
}

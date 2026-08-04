export interface Admin {
  id?: string;
  email: string;
  role: AdminRole;
  active: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export const ADMIN_ROLES: AdminRole[] = ['super_admin', 'editor', 'viewer'];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

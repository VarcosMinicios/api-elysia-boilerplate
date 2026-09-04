export interface RefreshSession {
  id: number;
  user_id: number;
  token_hash: string;
  family_id: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

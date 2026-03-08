import { JwtPayload, Role, UserSession } from '../models/auth.model';
import { AuthResponse } from '../models/http.model';
import { decodeJwtPayload } from '../../utils/jwt';

export function mapAuthResponseToSession(res: AuthResponse): UserSession {
  const now = Date.now();
  const expiresIn = Number(res.expires_in ?? 3600);

  const accessTokenExp = new Date(now + expiresIn * 1000);

  // Si tu modelo tiene refreshExp y no viene, ponle un valor "largo" o igual a access exp
  const refreshExp = new Date(now + 7 * 24 * 3600 * 1000);

  return {
    accessToken: res.access_token,
    accessTokenExp,
    refreshToken: res.refresh_token ?? null,
    refreshExp,
    roles: res.user?.roles ?? [],
    privileges: res.user?.privileges ?? [],
    email: res.user?.username ?? null,
    loginAt: new Date(now),
  } as UserSession;
}
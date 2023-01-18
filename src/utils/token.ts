import { User, Role } from '@prisma/client';

import { createJWEToken, createHMACSignature, decryptJWEToken } from './crypto';
import { HttpError } from './error';

interface UserToken {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat: string;
  exp: string;
}

// Temporary set token expiry for 1 year (development)
// 604800000 (1 week)
// 31536000000 (1 year)
const TOKEN_MAX_AGE = 31536000000;

export const createAuthToken = async (user: User) => {
  const { id, name, email, role } = user;
  const currentTime = Date.now();
  const tokenPayload: UserToken = {
    id,
    name,
    email,
    role,
    iat: currentTime.toString(),
    exp: (currentTime + TOKEN_MAX_AGE).toString(),
  };

  const jweToken = await createJWEToken(tokenPayload);
  const csrfToken = createHMACSignature(jweToken);

  return {
    jweToken,
    csrfToken,
  };
};

export const verifyAuthToken = async (token: string) => {
  const result = await decryptJWEToken(token);

  const payload: UserToken = JSON.parse(result.payload.toString());

  const expiryTime = parseInt(payload.exp, 10);
  const issuedTime = parseInt(payload.iat, 10);

  // Check token validity and expiry
  if (
    expiryTime - issuedTime < 0 ||
    expiryTime - issuedTime !== TOKEN_MAX_AGE
  ) {
    throw new HttpError('Invalid token age', 'UNAUTHORIZED');
  }

  if (Date.now() >= expiryTime) {
    throw new HttpError('Token is expired, please relogin!', 'UNAUTHORIZED');
  }

  return payload;
};

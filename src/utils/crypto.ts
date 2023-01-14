/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs/promises';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jose from 'node-jose';
import { Role } from '@prisma/client';

interface AuthToken {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat: string;
  exp: string;
}

export const encryptPassword = (password: string) =>
  bcrypt.hash(password, parseInt(process.env.HASH_ROUNDS || '10', 10));

export const comparePassword = (original: string, hashed: string) =>
  bcrypt.compare(original, hashed);

export const createJWEToken = async (payload: AuthToken) => {
  const publicKey = await fs.readFile(
    `${process.env.APP_PUBLIC_KEY_PATH as string}`
  );
  const joseEmonteerPublicKey = await jose.JWK.asKey(publicKey, 'pem');

  const jweToken = await jose.JWE.createEncrypt(
    {
      format: 'compact',
      contentAlg: 'A128GCM',
      fields: { alg: 'RSA-OAEP-256' },
    },
    joseEmonteerPublicKey
  )
    .update(JSON.stringify(payload))
    .final();

  return jweToken;
};

export const decryptJWEToken = async (token: string) => {
  const privateKey = await fs.readFile(
    `${process.env.APP_PRIVATE_KEY_PATH as string}`
  );
  const josePrivateKey = await jose.JWK.asKey(privateKey, 'pem');

  const result = await jose.JWE.createDecrypt(josePrivateKey).decrypt(token);

  return result;
};

export const createHMACSignature = (token: string) =>
  crypto
    .createHmac('sha256', token)
    .update(`${process.env.APP_SECRET_HASH as string}`)
    .digest('hex');

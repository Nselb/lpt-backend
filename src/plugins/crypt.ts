import { compareSync, hashSync } from 'bcrypt';

export function hashPassword(password: string, rounds: number) {
  return hashSync(password, rounds);
}

export function verifyPassword(passwordToVerify: string, password: string) {
  return compareSync(passwordToVerify, password);
}

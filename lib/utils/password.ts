import { pbkdf2Sync, randomBytes } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  // Salt 생성 (16바이트)
  const salt = randomBytes(16).toString('hex');
  
  // PBKDF2로 해싱 (100,000번 반복, SHA-512 사용)
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  
  // salt와 hash를 결합하여 반환
  return `${salt}:${hash}`;
}

export async function comparePassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  const newHash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === newHash;
} 
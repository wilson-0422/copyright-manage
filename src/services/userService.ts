import bcrypt from 'bcryptjs';
import * as UserModel from '../models/user';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export async function authenticate(username: string, password: string): Promise<AuthUser | null> {
  const user = UserModel.findByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, username: user.username, role: user.role };
}

export async function registerUser(username: string, password: string, email: string): Promise<AuthUser> {
  const existing = UserModel.findByUsername(username);
  if (existing) {
    throw new Error('用户名已存在');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = UserModel.create({
    username,
    password: hashedPassword,
    email: email || null,
    role: 'user',
  });

  return { id: result.lastInsertRowid as number, username, role: 'user' };
}

export function getUserById(id: number) {
  return UserModel.findById(id);
}

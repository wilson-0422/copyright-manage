import { getDatabase } from '../config/database';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  role: string;
  created_at: string;
}

export function findByUsername(username: string): User | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
}

export function findById(id: number): User | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function findAll(): User[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
}

export function create(user: Omit<User, 'id' | 'created_at'>): Database.RunResult {
  const db = getDatabase();
  return db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)').run(
    user.username, user.password, user.email, user.role
  );
}

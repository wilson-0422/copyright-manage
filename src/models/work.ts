import { getDatabase } from '../config/database';

export interface Work {
  id: number;
  title: string;
  type: string;
  description: string | null;
  author_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export function findAll(): Work[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT w.*, u.username as author_name
    FROM works w
    LEFT JOIN users u ON w.author_id = u.id
    ORDER BY w.created_at DESC
  `).all() as Work[];
}

export function findById(id: number): Work | undefined {
  const db = getDatabase();
  return db.prepare(`
    SELECT w.*, u.username as author_name
    FROM works w
    LEFT JOIN users u ON w.author_id = u.id
    WHERE w.id = ?
  `).get(id) as Work | undefined;
}

export function findByAuthorId(authorId: number): Work[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT w.*, u.username as author_name
    FROM works w
    LEFT JOIN users u ON w.author_id = u.id
    WHERE w.author_id = ?
    ORDER BY w.created_at DESC
  `).all(authorId) as Work[];
}

export function create(work: Omit<Work, 'id' | 'created_at' | 'updated_at' | 'author_name'>): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    'INSERT INTO works (title, type, description, author_id, status) VALUES (?, ?, ?, ?, ?)'
  ).run(work.title, work.type, work.description, work.author_id, work.status);
}

export function update(id: number, work: Partial<Pick<Work, 'title' | 'type' | 'description' | 'status'>>): Database.RunResult {
  const db = getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (work.title !== undefined) { fields.push('title = ?'); values.push(work.title); }
  if (work.type !== undefined) { fields.push('type = ?'); values.push(work.type); }
  if (work.description !== undefined) { fields.push('description = ?'); values.push(work.description); }
  if (work.status !== undefined) { fields.push('status = ?'); values.push(work.status); }

  fields.push("updated_at = datetime('now', 'localtime')");
  values.push(id);

  return db.prepare(`UPDATE works SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function remove(id: number): Database.RunResult {
  const db = getDatabase();
  return db.prepare('DELETE FROM works WHERE id = ?').run(id);
}

export function countByType(): { type: string; count: number }[] {
  const db = getDatabase();
  return db.prepare('SELECT type, COUNT(*) as count FROM works GROUP BY type').all() as { type: string; count: number }[];
}

export function countByStatus(): { status: string; count: number }[] {
  const db = getDatabase();
  return db.prepare('SELECT status, COUNT(*) as count FROM works GROUP BY status').all() as { status: string; count: number }[];
}

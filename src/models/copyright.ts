import { getDatabase } from '../config/database';

export interface Copyright {
  id: number;
  work_id: number;
  registration_number: string;
  status: string;
  registration_date: string;
  certificate_hash: string | null;
  confirmed_at: string | null;
  reviewer_id: number | null;
  work_title?: string;
  work_type?: string;
  reviewer_name?: string;
}

export function findAll(): Copyright[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT c.*, w.title as work_title, w.type as work_type, u.username as reviewer_name
    FROM copyrights c
    LEFT JOIN works w ON c.work_id = w.id
    LEFT JOIN users u ON c.reviewer_id = u.id
    ORDER BY c.registration_date DESC
  `).all() as Copyright[];
}

export function findById(id: number): Copyright | undefined {
  const db = getDatabase();
  return db.prepare(`
    SELECT c.*, w.title as work_title, w.type as work_type, u.username as reviewer_name
    FROM copyrights c
    LEFT JOIN works w ON c.work_id = w.id
    LEFT JOIN users u ON c.reviewer_id = u.id
    WHERE c.id = ?
  `).get(id) as Copyright | undefined;
}

export function findByWorkId(workId: number): Copyright | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM copyrights WHERE work_id = ?').get(workId) as Copyright | undefined;
}

export function findByRegistrationNumber(regNumber: string): Copyright | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM copyrights WHERE registration_number = ?').get(regNumber) as Copyright | undefined;
}

export function create(copyright: Omit<Copyright, 'id' | 'work_title' | 'work_type' | 'reviewer_name'>): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    'INSERT INTO copyrights (work_id, registration_number, status, registration_date, certificate_hash, confirmed_at, reviewer_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    copyright.work_id, copyright.registration_number, copyright.status,
    copyright.registration_date, copyright.certificate_hash, copyright.confirmed_at, copyright.reviewer_id
  );
}

export function updateStatus(id: number, status: string, reviewerId: number, confirmedAt: string): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    "UPDATE copyrights SET status = ?, reviewer_id = ?, confirmed_at = ? WHERE id = ?"
  ).run(status, reviewerId, confirmedAt, id);
}

export function countByStatus(): { status: string; count: number }[] {
  const db = getDatabase();
  return db.prepare('SELECT status, COUNT(*) as count FROM copyrights GROUP BY status').all() as { status: string; count: number }[];
}

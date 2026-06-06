import { getDatabase } from '../config/database';

export interface Contract {
  id: number;
  work_id: number;
  licensee: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  revenue_share: number;
  status: string;
  created_at: string;
  work_title?: string;
  work_type?: string;
}

export function findAll(): Contract[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT ct.*, w.title as work_title, w.type as work_type
    FROM contracts ct
    LEFT JOIN works w ON ct.work_id = w.id
    ORDER BY ct.created_at DESC
  `).all() as Contract[];
}

export function findById(id: number): Contract | undefined {
  const db = getDatabase();
  return db.prepare(`
    SELECT ct.*, w.title as work_title, w.type as work_type
    FROM contracts ct
    LEFT JOIN works w ON ct.work_id = w.id
    WHERE ct.id = ?
  `).get(id) as Contract | undefined;
}

export function findByWorkId(workId: number): Contract[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT ct.*, w.title as work_title, w.type as work_type
    FROM contracts ct
    LEFT JOIN works w ON ct.work_id = w.id
    WHERE ct.work_id = ?
    ORDER BY ct.created_at DESC
  `).all(workId) as Contract[];
}

export function create(contract: Omit<Contract, 'id' | 'created_at' | 'work_title' | 'work_type'>): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    'INSERT INTO contracts (work_id, licensee, contract_type, start_date, end_date, revenue_share, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    contract.work_id, contract.licensee, contract.contract_type,
    contract.start_date, contract.end_date, contract.revenue_share, contract.status
  );
}

export function updateStatus(id: number, status: string): Database.RunResult {
  const db = getDatabase();
  return db.prepare('UPDATE contracts SET status = ? WHERE id = ?').run(status, id);
}

export function countByStatus(): { status: string; count: number }[] {
  const db = getDatabase();
  return db.prepare('SELECT status, COUNT(*) as count FROM contracts GROUP BY status').all() as { status: string; count: number }[];
}

export function findExpiringSoon(days: number): Contract[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT ct.*, w.title as work_title, w.type as work_type
    FROM contracts ct
    LEFT JOIN works w ON ct.work_id = w.id
    WHERE ct.status = '生效中'
    AND date(ct.end_date) <= date('now', '+' || ? || ' days')
    ORDER BY ct.end_date ASC
  `).all(days) as Contract[];
}

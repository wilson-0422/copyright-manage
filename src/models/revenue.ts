import { getDatabase } from '../config/database';

export interface Revenue {
  id: number;
  contract_id: number;
  amount: number;
  period: string;
  status: string;
  settled_at: string | null;
  created_at: string;
  contract_licensee?: string;
  work_title?: string;
  revenue_share?: number;
}

export function findAll(): Revenue[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT r.*, ct.licensee as contract_licensee, ct.revenue_share, w.title as work_title
    FROM revenues r
    LEFT JOIN contracts ct ON r.contract_id = ct.id
    LEFT JOIN works w ON ct.work_id = w.id
    ORDER BY r.created_at DESC
  `).all() as Revenue[];
}

export function findById(id: number): Revenue | undefined {
  const db = getDatabase();
  return db.prepare(`
    SELECT r.*, ct.licensee as contract_licensee, ct.revenue_share, w.title as work_title
    FROM revenues r
    LEFT JOIN contracts ct ON r.contract_id = ct.id
    LEFT JOIN works w ON ct.work_id = w.id
    WHERE r.id = ?
  `).get(id) as Revenue | undefined;
}

export function findByContractId(contractId: number): Revenue[] {
  const db = getDatabase();
  return db.prepare(`
    SELECT r.*, ct.licensee as contract_licensee, ct.revenue_share, w.title as work_title
    FROM revenues r
    LEFT JOIN contracts ct ON r.contract_id = ct.id
    LEFT JOIN works w ON ct.work_id = w.id
    WHERE r.contract_id = ?
    ORDER BY r.period DESC
  `).all(contractId) as Revenue[];
}

export function create(revenue: Omit<Revenue, 'id' | 'created_at' | 'settled_at' | 'contract_licensee' | 'work_title' | 'revenue_share'>): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    'INSERT INTO revenues (contract_id, amount, period, status) VALUES (?, ?, ?, ?)'
  ).run(revenue.contract_id, revenue.amount, revenue.period, revenue.status);
}

export function settle(id: number): Database.RunResult {
  const db = getDatabase();
  return db.prepare(
    "UPDATE revenues SET status = '已结算', settled_at = datetime('now', 'localtime') WHERE id = ?"
  ).run(id);
}

export function getTotalByStatus(): { status: string; total: number }[] {
  const db = getDatabase();
  return db.prepare('SELECT status, SUM(amount) as total FROM revenues GROUP BY status').all() as { status: string; total: number }[];
}

export function getTotalRevenue(): number {
  const db = getDatabase();
  const result = db.prepare("SELECT SUM(amount) as total FROM revenues WHERE status = '已结算'").get() as { total: number | null };
  return result.total || 0;
}

export function getPendingRevenue(): number {
  const db = getDatabase();
  const result = db.prepare("SELECT SUM(amount) as total FROM revenues WHERE status = '待结算'").get() as { total: number | null };
  return result.total || 0;
}

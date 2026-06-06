import SHA256 from 'crypto-js/sha256';
import * as CopyrightModel from '../models/copyright';
import * as WorkModel from '../models/work';

function generateRegistrationNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CR-${year}${month}${day}-${random}`;
}

function generateCertificateHash(workId: number, registrationNumber: string): string {
  const timestamp = Date.now().toString();
  const raw = `${workId}-${registrationNumber}-${timestamp}-copyright-manage`;
  return SHA256(raw).toString();
}

export function getAllCopyrights() {
  return CopyrightModel.findAll();
}

export function getCopyrightById(id: number) {
  return CopyrightModel.findById(id);
}

export function getCopyrightByWorkId(workId: number) {
  return CopyrightModel.findByWorkId(workId);
}

export function registerCopyright(workId: number) {
  const work = WorkModel.findById(workId);
  if (!work) {
    throw new Error('作品不存在');
  }

  const existing = CopyrightModel.findByWorkId(workId);
  if (existing) {
    throw new Error('该作品已登记版权');
  }

  const registrationNumber = generateRegistrationNumber();
  const certificateHash = generateCertificateHash(workId, registrationNumber);

  CopyrightModel.create({
    work_id: workId,
    registration_number: registrationNumber,
    status: '待审核',
    registration_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    certificate_hash: certificateHash,
    confirmed_at: null,
    reviewer_id: null,
  });

  WorkModel.update(workId, { status: '已登记' });

  return { registrationNumber, certificateHash };
}

export function confirmCopyright(id: number, reviewerId: number) {
  const copyright = CopyrightModel.findById(id);
  if (!copyright) {
    throw new Error('版权记录不存在');
  }
  if (copyright.status !== '待审核') {
    throw new Error('当前状态不允许确权操作');
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  CopyrightModel.updateStatus(id, '已确权', reviewerId, now);
  WorkModel.update(copyright.work_id, { status: '已确权' });
}

export function rejectCopyright(id: number, reviewerId: number) {
  const copyright = CopyrightModel.findById(id);
  if (!copyright) {
    throw new Error('版权记录不存在');
  }
  if (copyright.status !== '待审核') {
    throw new Error('当前状态不允许驳回操作');
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  CopyrightModel.updateStatus(id, '已驳回', reviewerId, now);
  WorkModel.update(copyright.work_id, { status: '已驳回' });
}

export function traceCopyright(registrationNumber: string) {
  const copyright = CopyrightModel.findByRegistrationNumber(registrationNumber);
  if (!copyright) return null;

  const work = WorkModel.findById(copyright.work_id);
  return { copyright, work };
}

export function getCopyrightStats() {
  return CopyrightModel.countByStatus();
}

import * as RevenueModel from '../models/revenue';
import * as ContractModel from '../models/contract';

export function getAllRevenues() {
  return RevenueModel.findAll();
}

export function getRevenueById(id: number) {
  return RevenueModel.findById(id);
}

export function getRevenuesByContractId(contractId: number) {
  return RevenueModel.findByContractId(contractId);
}

export function createRevenue(data: { contract_id: number; amount: number; period: string; status: string }) {
  const contract = ContractModel.findById(data.contract_id);
  if (!contract) {
    throw new Error('合同不存在');
  }

  return RevenueModel.create(data);
}

export function settleRevenue(id: number) {
  const revenue = RevenueModel.findById(id);
  if (!revenue) {
    throw new Error('收益记录不存在');
  }
  if (revenue.status !== '待结算') {
    throw new Error('只有待结算的收益可以结算');
  }

  RevenueModel.settle(id);
}

export function getRevenueSummary() {
  return {
    totalRevenue: RevenueModel.getTotalRevenue(),
    pendingRevenue: RevenueModel.getPendingRevenue(),
    byStatus: RevenueModel.getTotalByStatus(),
  };
}

export function calculateAuthorShare(contractId: number, amount: number): { authorShare: number; licenseeShare: number } {
  const contract = ContractModel.findById(contractId);
  if (!contract) {
    throw new Error('合同不存在');
  }

  const authorShare = amount * contract.revenue_share;
  const licenseeShare = amount * (1 - contract.revenue_share);

  return { authorShare, licenseeShare };
}

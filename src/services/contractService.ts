import * as ContractModel from '../models/contract';
import * as WorkModel from '../models/work';

export function getAllContracts() {
  return ContractModel.findAll();
}

export function getContractById(id: number) {
  return ContractModel.findById(id);
}

export function getContractsByWorkId(workId: number) {
  return ContractModel.findByWorkId(workId);
}

export function createContract(data: {
  work_id: number;
  licensee: string;
  contract_type: string;
  start_date: string;
  end_date: string;
  revenue_share: number;
  status: string;
}) {
  const work = WorkModel.findById(data.work_id);
  if (!work) {
    throw new Error('作品不存在');
  }

  return ContractModel.create(data);
}

export function activateContract(id: number) {
  const contract = ContractModel.findById(id);
  if (!contract) {
    throw new Error('合同不存在');
  }
  if (contract.status !== '草稿') {
    throw new Error('只有草稿状态的合同可以激活');
  }
  ContractModel.updateStatus(id, '生效中');
}

export function terminateContract(id: number) {
  const contract = ContractModel.findById(id);
  if (!contract) {
    throw new Error('合同不存在');
  }
  if (contract.status !== '生效中') {
    throw new Error('只有生效中的合同可以终止');
  }
  ContractModel.updateStatus(id, '已终止');
}

export function expireContract(id: number) {
  ContractModel.updateStatus(id, '已到期');
}

export function getExpiringContracts(days: number = 30) {
  return ContractModel.findExpiringSoon(days);
}

export function getContractStats() {
  return ContractModel.countByStatus();
}

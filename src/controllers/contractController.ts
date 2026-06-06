import { Request, Response } from 'express';
import * as ContractService from '../services/contractService';
import * as WorkService from '../services/workService';

export function listContracts(req: Request, res: Response) {
  try {
    const contracts = ContractService.getAllContracts();
    res.render('contracts/list', { contracts });
  } catch (err: any) {
    res.status(500).render('contracts/list', { contracts: [], error: err.message });
  }
}

export function getContractDetail(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const contract = ContractService.getContractById(id);
    if (!contract) {
      return res.status(404).render('contracts/detail', { contract: null, error: '合同不存在' });
    }
    res.render('contracts/detail', { contract, error: null });
  } catch (err: any) {
    res.status(500).render('contracts/detail', { contract: null, error: err.message });
  }
}

export function showCreateContract(req: Request, res: Response) {
  try {
    const works = WorkService.getAllWorks();
    res.render('contracts/create', { works, error: null });
  } catch (err: any) {
    res.render('contracts/create', { works: [], error: err.message });
  }
}

export function createContract(req: Request, res: Response) {
  try {
    const { work_id, licensee, contract_type, start_date, end_date, revenue_share, status } = req.body;
    ContractService.createContract({
      work_id: parseInt(work_id),
      licensee,
      contract_type,
      start_date,
      end_date,
      revenue_share: parseFloat(revenue_share) || 0.5,
      status: status || '草稿',
    });
    res.redirect('/contracts');
  } catch (err: any) {
    const works = WorkService.getAllWorks();
    res.render('contracts/create', { works, error: err.message });
  }
}

export function activateContract(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    ContractService.activateContract(id);
    res.redirect(`/contracts/${id}`);
  } catch (err: any) {
    res.redirect(`/contracts/${req.params.id}`);
  }
}

export function terminateContract(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    ContractService.terminateContract(id);
    res.redirect(`/contracts/${id}`);
  } catch (err: any) {
    res.redirect(`/contracts/${req.params.id}`);
  }
}

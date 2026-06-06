import { Request, Response } from 'express';
import * as RevenueService from '../services/revenueService';

export function listRevenues(req: Request, res: Response) {
  try {
    const revenues = RevenueService.getAllRevenues();
    const summary = RevenueService.getRevenueSummary();
    res.render('revenues/list', { revenues, summary });
  } catch (err: any) {
    res.status(500).render('revenues/list', { revenues: [], summary: { totalRevenue: 0, pendingRevenue: 0, byStatus: [] }, error: err.message });
  }
}

export function settleRevenue(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    RevenueService.settleRevenue(id);
    res.redirect('/revenues');
  } catch (err: any) {
    res.redirect('/revenues');
  }
}

export function showCreateRevenue(req: Request, res: Response) {
  res.redirect('/revenues');
}

export function createRevenue(req: Request, res: Response) {
  try {
    const { contract_id, amount, period, status } = req.body;
    RevenueService.createRevenue({
      contract_id: parseInt(contract_id),
      amount: parseFloat(amount),
      period,
      status: status || '待结算',
    });
    res.redirect('/revenues');
  } catch (err: any) {
    res.redirect('/revenues');
  }
}

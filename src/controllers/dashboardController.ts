import { Request, Response } from 'express';
import * as WorkService from '../services/workService';
import * as CopyrightService from '../services/copyrightService';
import * as ContractService from '../services/contractService';
import * as RevenueService from '../services/revenueService';

export function showDashboard(req: Request, res: Response) {
  try {
    const workStats = WorkService.getWorkStats();
    const copyrightStats = CopyrightService.getCopyrightStats();
    const contractStats = ContractService.getContractStats();
    const revenueSummary = RevenueService.getRevenueSummary();
    const expiringContracts = ContractService.getExpiringContracts(30);

    const totalWorks = workStats.byType.reduce((sum, item) => sum + item.count, 0);
    const totalCopyrights = copyrightStats.reduce((sum, item) => sum + item.count, 0);
    const totalContracts = contractStats.reduce((sum, item) => sum + item.count, 0);

    res.render('dashboard/overview', {
      workStats,
      copyrightStats,
      contractStats,
      revenueSummary,
      expiringContracts,
      totalWorks,
      totalCopyrights,
      totalContracts,
    });
  } catch (err: any) {
    res.status(500).render('dashboard/overview', {
      workStats: { byType: [], byStatus: [] },
      copyrightStats: [],
      contractStats: [],
      revenueSummary: { totalRevenue: 0, pendingRevenue: 0, byStatus: [] },
      expiringContracts: [],
      totalWorks: 0,
      totalCopyrights: 0,
      totalContracts: 0,
      error: err.message,
    });
  }
}

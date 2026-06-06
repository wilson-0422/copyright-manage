import { Request, Response } from 'express';
import * as CopyrightService from '../services/copyrightService';

export function listCopyrights(req: Request, res: Response) {
  try {
    const copyrights = CopyrightService.getAllCopyrights();
    res.render('copyrights/list', { copyrights });
  } catch (err: any) {
    res.status(500).render('copyrights/list', { copyrights: [], error: err.message });
  }
}

export function getCopyrightDetail(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const copyright = CopyrightService.getCopyrightById(id);
    if (!copyright) {
      return res.status(404).render('copyrights/detail', { copyright: null, error: '版权记录不存在' });
    }
    res.render('copyrights/detail', { copyright, error: null });
  } catch (err: any) {
    res.status(500).render('copyrights/detail', { copyright: null, error: err.message });
  }
}

export function showRegisterCopyright(req: Request, res: Response) {
  res.render('copyrights/register', { error: null });
}

export function registerCopyright(req: Request, res: Response) {
  try {
    const workId = parseInt(req.body.work_id);
    const result = CopyrightService.registerCopyright(workId);
    res.redirect('/copyrights');
  } catch (err: any) {
    res.render('copyrights/register', { error: err.message });
  }
}

export function confirmCopyright(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const user = req.session.user!;
    CopyrightService.confirmCopyright(id, user.id);
    res.redirect(`/copyrights/${id}`);
  } catch (err: any) {
    res.redirect(`/copyrights/${req.params.id}`);
  }
}

export function rejectCopyright(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const user = req.session.user!;
    CopyrightService.rejectCopyright(id, user.id);
    res.redirect(`/copyrights/${id}`);
  } catch (err: any) {
    res.redirect(`/copyrights/${req.params.id}`);
  }
}

export function traceCopyright(req: Request, res: Response) {
  try {
    const registrationNumber = req.query.registration_number as string;
    if (!registrationNumber) {
      return res.render('copyrights/detail', { copyright: null, error: null, traceMode: true });
    }

    const result = CopyrightService.traceCopyright(registrationNumber);
    if (!result) {
      return res.render('copyrights/detail', { copyright: null, error: '未找到对应版权记录', traceMode: true });
    }

    res.render('copyrights/detail', { copyright: result.copyright, work: result.work, error: null, traceMode: true });
  } catch (err: any) {
    res.render('copyrights/detail', { copyright: null, error: err.message, traceMode: true });
  }
}

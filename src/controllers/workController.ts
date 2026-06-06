import { Request, Response } from 'express';
import * as WorkService from '../services/workService';

export function listWorks(req: Request, res: Response) {
  try {
    const works = WorkService.getAllWorks();
    res.render('works/list', { works });
  } catch (err: any) {
    res.status(500).render('works/list', { works: [], error: err.message });
  }
}

export function getWorkDetail(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const work = WorkService.getWorkById(id);
    if (!work) {
      return res.status(404).render('works/detail', { work: null, error: '作品不存在' });
    }
    res.render('works/detail', { work, error: null });
  } catch (err: any) {
    res.status(500).render('works/detail', { work: null, error: err.message });
  }
}

export function showCreateWork(req: Request, res: Response) {
  res.render('works/create', { error: null });
}

export function createWork(req: Request, res: Response) {
  try {
    const { title, type, description, status } = req.body;
    const user = req.session.user!;
    WorkService.createWork({
      title,
      type,
      description: description || null,
      author_id: user.id,
      status: status || '草稿',
    });
    res.redirect('/works');
  } catch (err: any) {
    res.render('works/create', { error: err.message });
  }
}

export function showEditWork(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const work = WorkService.getWorkById(id);
    if (!work) {
      return res.status(404).redirect('/works');
    }
    res.render('works/edit', { work, error: null });
  } catch (err: any) {
    res.status(500).redirect('/works');
  }
}

export function updateWork(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { title, type, description, status } = req.body;
    WorkService.updateWork(id, {
      title,
      type,
      description: description || null,
      status,
    });
    res.redirect(`/works/${id}`);
  } catch (err: any) {
    const work = WorkService.getWorkById(parseInt(req.params.id));
    res.render('works/edit', { work, error: err.message });
  }
}

export function deleteWork(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    WorkService.deleteWork(id);
    res.redirect('/works');
  } catch (err: any) {
    res.redirect('/works');
  }
}

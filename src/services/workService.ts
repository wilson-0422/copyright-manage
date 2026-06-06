import * as WorkModel from '../models/work';

export function getAllWorks() {
  return WorkModel.findAll();
}

export function getWorkById(id: number) {
  return WorkModel.findById(id);
}

export function getWorksByAuthor(authorId: number) {
  return WorkModel.findByAuthorId(authorId);
}

export function createWork(data: { title: string; type: string; description: string; author_id: number; status: string }) {
  return WorkModel.create(data);
}

export function updateWork(id: number, data: Partial<Pick<WorkModel.Work, 'title' | 'type' | 'description' | 'status'>>) {
  return WorkModel.update(id, data);
}

export function deleteWork(id: number) {
  return WorkModel.remove(id);
}

export function getWorkStats() {
  return {
    byType: WorkModel.countByType(),
    byStatus: WorkModel.countByStatus(),
  };
}

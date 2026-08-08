import { Router } from 'express';
import { branches, setBranches } from '../db';
import { Branch } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  res.json(branches);
});

router.post('/', (req, res) => {
  const newBranch: Branch = req.body;
  newBranch.id = newBranch.id || `br-${Date.now()}`;
  const idx = branches.findIndex((b) => b.id === newBranch.id);
  if (idx >= 0) {
    branches[idx] = newBranch;
  } else {
    branches.push(newBranch);
  }
  res.json({ success: true, branch: newBranch });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  setBranches(branches.filter((b) => b.id !== id));
  res.json({ success: true });
});

export default router;

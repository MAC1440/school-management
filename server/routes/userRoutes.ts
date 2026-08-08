import { Router } from 'express';
import { users, setUsers } from '../db';
import { User } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { role, branchId } = req.query;
  let list = [...users];
  if (role) {
    list = list.filter((u) => u.role === role);
  }
  if (branchId) {
    list = list.filter((u) => u.branchId === branchId);
  }
  res.json(list);
});

router.post('/', (req, res) => {
  const newUser: User = req.body;
  const existingIndex = users.findIndex((u) => u.id === newUser.id);
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...newUser };
  } else {
    newUser.id = newUser.id || `usr-${Date.now()}`;
    users.push(newUser);
  }
  res.json({ success: true, user: newUser });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  setUsers(users.filter((u) => u.id !== id));
  res.json({ success: true });
});

export default router;

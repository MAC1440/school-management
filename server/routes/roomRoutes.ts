import { Router } from 'express';
import { rooms, setRooms } from '../db';
import { Room } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { branchId } = req.query;
  if (branchId) {
    return res.json(rooms.filter((r) => r.branchId === branchId));
  }
  res.json(rooms);
});

router.post('/', (req, res) => {
  const room: Room = req.body;
  room.id = room.id || `rm-${Date.now()}`;
  const idx = rooms.findIndex((r) => r.id === room.id);
  if (idx >= 0) {
    rooms[idx] = room;
  } else {
    rooms.push(room);
  }
  res.json({ success: true, room });
});

router.delete('/:id', (req, res) => {
  setRooms(rooms.filter((r) => r.id !== req.params.id));
  res.json({ success: true });
});

export default router;

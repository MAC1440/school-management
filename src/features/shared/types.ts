import { Role } from '../auth/types';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: Role;
  date: string;
  priority: 'urgent' | 'normal' | 'info';
  targetAudience: 'all' | 'students' | 'teachers' | 'principals';
}

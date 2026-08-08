export type GradeCategory = 'Homework' | 'Quiz' | 'Midterm' | 'Final' | 'Project';

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  title: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  date: string;
  feedback?: string;
}

export interface AssessmentItem {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'Quiz' | 'Test' | 'Exam' | 'Paper';
  dueDate: string;
  weightage: string;
  description?: string;
  scheduledDate?: string;
  totalMarks?: number;
  syllabusTopics?: string[];
}

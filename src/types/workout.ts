export interface Exercise {
  id: string | number;
  name: string;
  sets: number;
  target_reps: string;
}

export interface Workout {
  id: string;
  name: string;
  created_at: string;
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  template_id: string;
  date: string;
  duration_minutes?: number;
  status: 'completed' | 'in_progress';
  completed_exercises: Array<{
    exercise_id: string | number;
    name: string;
    completed: boolean;
    completed_sets: Array<{
      done: boolean;
      weight?: number;
      reps?: number;
    }>;
  }>;
}
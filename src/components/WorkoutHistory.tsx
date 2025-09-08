"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Calendar, Repeat, Trophy } from 'lucide-react';

interface WorkoutSession {
  id: string;
  template_id: string;
  date: string;
  duration_minutes?: number;
  status: 'completed' | 'in_progress';
  completed_exercises: any[];
}

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
  onRepeatWorkout: (templateId: string) => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ 
  sessions, 
  onRepeatWorkout 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWorkoutName = (session: WorkoutSession) => {
    return session.completed_exercises[0]?.name || 'Unknown Workout';
  };

  const getCompletedSetsCount = (session: WorkoutSession) => {
    return session.completed_exercises.reduce((total, exercise) => {
      return total + exercise.completed_sets.filter((set: any) => set.done).length;
    }, 0);
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No workout history yet</h3>
          <p className="text-muted-foreground text-center">
            Complete your first workout to see your progress here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Workout History</h2>
        <Badge variant="secondary">{sessions.length} workouts</Badge>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id} className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {session.status === 'completed' && (
                      <Trophy className="h-5 w-5 text-accent" />
                    )}
                    {getWorkoutName(session)}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(session.date)}
                    </span>
                    {session.duration_minutes && (
                      <span>
                        {session.duration_minutes} minutes
                      </span>
                    )}
                    <span>
                      {session.completed_exercises.filter(ex => ex.completed).length}/{session.completed_exercises.length} exercises
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={session.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {session.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRepeatWorkout(session.template_id)}
                  >
                    <Repeat className="h-4 w-4 mr-1" />
                    Repeat
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {session.completed_exercises.map((exercise, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium">{exercise.name}:</span>
                    <span className="text-muted-foreground ml-2">
                      {exercise.completed_sets.filter((set: any) => set.done).length}/{exercise.completed_sets.length} sets
                    </span>
                    {exercise.completed_sets.some((set: any) => set.weight) && (
                      <span className="text-muted-foreground ml-2">
                        (Best: {Math.max(...exercise.completed_sets.filter((set: any) => set.weight).map((set: any) => set.weight))}kg)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
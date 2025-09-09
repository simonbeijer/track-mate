"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Superscript, Target, Weight, ListChecks , Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string | number;
  name: string;
  sets: number;
  target_reps: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface WorkoutSessionProps {
  workout: Workout;
  onBack: () => void;
  onWorkoutComplete: (sessionData: any) => void;
}

interface ExerciseState {
  done: boolean;
  showSets: boolean;
  showWeight: boolean;
  showReps: boolean;
  sets: { done: boolean; weight?: number; reps?: number; }[];
}

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({ 
  workout, 
  onBack, 
  onWorkoutComplete 
}) => {
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({});
  const [startTime] = useState(new Date());
  const { toast } = useToast();

  // Initialize exercise states
  useEffect(() => {
    const initialStates: Record<string, ExerciseState> = {};
    workout.exercises.forEach(exercise => {
      initialStates[exercise.id] = {
        done: false,
        showSets: false,
        showWeight: false,
        showReps: false,
        sets: Array(exercise.sets).fill(null).map(() => ({
          done: false,
          weight: undefined,
          reps: undefined
        }))
      };
    });
    setExerciseStates(initialStates);
  }, [workout]);

  const toggleExerciseDone = (exerciseId: string | number) => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        done: !prev[exerciseId].done
      }
    }));
  };

  const toggleOption = (exerciseId: string | number, option: 'showSets' | 'showWeight' | 'showReps') => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [option]: !prev[exerciseId][option]
      }
    }));
  };

  const updateSet = (exerciseId: string | number, setIndex: number, data: Partial<{ done: boolean; weight?: number; reps?: number; }>) => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: prev[exerciseId].sets.map((set, idx) => 
          idx === setIndex ? { ...set, ...data } : set
        )
      }
    }));
  };

  const getCompletionPercentage = () => {
    const completedExercises = Object.values(exerciseStates).filter(state => state.done).length;
    return workout.exercises.length > 0 ? Math.round((completedExercises / workout.exercises.length) * 100) : 0;
  };

  const isWorkoutComplete = () => {
    return Object.values(exerciseStates).every(state => state.done);
  };

  const calculateDuration = () => {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.round(durationMs / 60000);
    return minutes;
  };

  const handleCompleteWorkout = () => {
    const duration = calculateDuration();
    const completionData = {
      id: Date.now().toString(),
      template_id: workout.id,
      date: new Date().toISOString(),
      duration_minutes: duration,
      status: 'completed',
      completed_exercises: workout.exercises.map(exercise => ({
        exercise_id: exercise.id,
        name: exercise.name,
        completed: exerciseStates[exercise.id]?.done || false,
        completed_sets: exerciseStates[exercise.id]?.sets || []
      }))
    };

    onWorkoutComplete(completionData);
    
    toast({
      title: "Workout Complete! 🎉",
      description: `Great job finishing "${workout.name}" in ${duration} minutes!`,
    });
  };

  const completionPercent = getCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <p style={{ color: 'hsl(215 16% 47%)' }}>
            {completionPercent}% Complete • {workout.exercises.length} exercises
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5" style={{ color: 'hsl(167 79% 39%)' }} />
            <div className="flex-1">
              <Progress value={completionPercent} className="h-3" />
            </div>
            <span className="text-sm font-medium">{completionPercent}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((exercise) => {
          const exerciseState = exerciseStates[exercise.id];
          if (!exerciseState) return null;

          return (
            <Card key={exercise.id} className={`shadow-card transition-all ${exerciseState.done ? 'border-accent bg-accent/5' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={exerciseState.done}
                      onChange={(e) => toggleExerciseDone(exercise.id)}
                      className="h-5 w-5"
                    />
                    <div>
                      <CardTitle className={`text-lg ${exerciseState.done ? 'line-through' : ''}`} 
                                 style={exerciseState.done ? { color: 'hsl(215 16% 47%)' } : {}}>
                        {exercise.name}
                      </CardTitle>
                      <p className="text-sm" style={{ color: 'hsl(215 16% 47%)' }}>
                        {exercise.sets} sets × {exercise.target_reps} reps
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant={exerciseState.showSets ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(exercise.id, 'showSets')}
                      className="h-8 w-8 p-0"
                    >
                      <ListChecks  className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={exerciseState.showWeight ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(exercise.id, 'showWeight')}
                      className="h-8 w-8 p-0"
                    >
                      <Weight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={exerciseState.showReps ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption(exercise.id, 'showReps')}
                      className="h-8 w-8 p-0"
                    >
                      <Superscript className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {(exerciseState.showSets || exerciseState.showWeight || exerciseState.showReps) && (
                <CardContent>
                  <div className="space-y-3">
                    {Array(exercise.sets).fill(null).map((_, setIndex) => {
                      const setData = exerciseState.sets[setIndex];
                      return (
                        <div key={setIndex} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                          {exerciseState.showSets && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${exercise.id}-${setIndex}`}
                                checked={setData?.done || false}
                                onChange={(e) => 
                                  updateSet(exercise.id, setIndex, { done: e.target.checked })
                                }
                              />
                              <label 
                                htmlFor={`${exercise.id}-${setIndex}`}
                                className="text-sm font-medium whitespace-nowrap"
                              >
                                Set {setIndex + 1}
                              </label>
                            </div>
                          )}
                          
                          <div className="flex gap-2 ml-auto">
                            {exerciseState.showWeight && (
                              <>
                                <Input
                                  type="number"
                                  placeholder="Weight"
                                  className="w-20 h-8"
                                  value={setData?.weight || ''}
                                  onChange={(e) => 
                                    updateSet(exercise.id, setIndex, { 
                                      weight: parseFloat(e.target.value) || undefined 
                                    })
                                  }
                                />
                                <span className="text-xs text-muted-foreground self-center">kg</span>
                              </>
                            )}
                            
                            {exerciseState.showReps && (
                              <>
                                <Input
                                  type="number"
                                  placeholder="Reps"
                                  className="w-16 h-8"
                                  value={setData?.reps || ''}
                                  onChange={(e) => 
                                    updateSet(exercise.id, setIndex, { 
                                      reps: parseInt(e.target.value) || undefined 
                                    })
                                  }
                                />
                                <span className="text-xs text-muted-foreground self-center">reps</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Complete Workout Button */}
      {isWorkoutComplete() && (
        <Card className="border-accent shadow-glow bg-accent/5">
          <CardContent className="pt-6">
            <Button 
              onClick={handleCompleteWorkout}
              className="w-full bg-gradient-success hover:opacity-90 text-white"
              size="lg"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Complete Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/HeroSection';
import { WorkoutImport } from '@/components/WorkoutImport';
import { WorkoutSession } from '@/components/WorkoutSession';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, History, Upload } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Workout, WorkoutSession as WorkoutSessionType } from '@/types/workout';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'import' | 'session'>('home');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutSessionType[]>('workout-history', []);
  const [workoutTemplates, setWorkoutTemplates] = useLocalStorage<Workout[]>('workout-templates', []);

  const handleWorkoutImported = (workout: Workout) => {
    setWorkoutTemplates(prev => [...prev, workout]);
    setCurrentWorkout(workout);
    setCurrentView('session');
  };

  const handleWorkoutComplete = (sessionData: WorkoutSessionType) => {
    setWorkoutHistory(prev => [sessionData, ...prev]);
    setCurrentView('home');
    setCurrentWorkout(null);
  };

  const handleRepeatWorkout = (templateId: string) => {
    const template = workoutTemplates.find(w => w.id === templateId);
    if (template) {
      setCurrentWorkout(template);
      setCurrentView('session');
    }
  };

  const handleGetStarted = () => {
    setCurrentView('import');
  };

  const handleBack = () => {
    setCurrentView('home');
    setCurrentWorkout(null);
  };

  // Show workout session
  if (currentView === 'session' && currentWorkout) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <WorkoutSession
            workout={currentWorkout}
            onBack={handleBack}
            onWorkoutComplete={handleWorkoutComplete}
          />
        </div>
      </div>
    );
  }

  // Show import page
  if (currentView === 'import') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">Import Workout</h1>
          </div>
          <WorkoutImport onWorkoutImported={handleWorkoutImported} />
        </div>
      </div>
    );
  }

  // Show home page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 iconColor" style={{ color: 'hsl(167 79% 39%)' }} />
            <h1 className="text-xl font-bold">Track Mate</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200">
              <TabsTrigger value="history" className="flex items-center gap-2 ">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Templates
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-6">
              <WorkoutHistory 
                sessions={workoutHistory}
                onRepeatWorkout={handleRepeatWorkout}
              />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Saved Templates</h2>
                {workoutTemplates.map((template) => (
                  <Card key={template.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          <p className="text-muted-foreground">
                            {template.exercises.length} exercises
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRepeatWorkout(template.id)}
                          variant="default"
                        >
                          Start Workout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        
      </div>
    </div>
  );
}

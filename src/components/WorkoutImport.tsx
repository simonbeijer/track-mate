"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Upload, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  name: string;
  sets: number;
  target_reps: string;
}

interface WorkoutImportProps {
  onWorkoutImported: (workout: any) => void;
}

export const WorkoutImport: React.FC<WorkoutImportProps> = ({ onWorkoutImported }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const promptHelper = `Generate a workout in this exact JSON format:

{
  "Push Workout": {
    "Bench Press": {
      "sets": "4",
      "reps": "6-8"
    },
    "Overhead Press": {
      "sets": "3", 
      "reps": "8-10"
    }
  }
}`;

  const copyPrompt = () => {
    navigator.clipboard.writeText('Now give me this in a JSON format:\n\n' + promptHelper);
    toast({
      title: "Prompt copied!",
      description: "Paste this into ChatGPT or your AI tool.",
    });
  };

  const validateAndPreviewWorkout = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "No JSON provided",
        description: "Please paste your workout JSON first.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      const parsed = JSON.parse(jsonInput);
      const workoutNameFromJson = Object.keys(parsed)[0];
      const exercisesData = parsed[workoutNameFromJson];
      
      if (!workoutNameFromJson || !exercisesData) {
        throw new Error('Invalid workout format');
      }

      setWorkoutName(workoutNameFromJson);
      const exercisesList: Exercise[] = Object.entries(exercisesData).map(([name, details]: [string, any]) => ({
        name,
        sets: parseInt(details.sets) || 3,
        target_reps: details.reps || '8-10'
      }));
      
      setExercises(exercisesList);
      setShowPreview(true);
      
    } catch (error) {
      toast({
        title: "Invalid JSON format",
        description: "Please check your JSON format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const saveWorkout = () => {
    const workout = {
      id: Date.now().toString(),
      name: workoutName,
      created_at: new Date().toISOString(),
      exercises: exercises.map(exercise => ({
        id: Date.now() + Math.random(),
        name: exercise.name,
        sets: exercise.sets,
        target_reps: exercise.target_reps
      }))
    };

    onWorkoutImported(workout);
    
    toast({
      title: "Workout saved!",
      description: `"${workoutName}" is ready to start.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Prompt Helper */}
      <Card className="shadow-card border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Get the Right Format</CardTitle>
          <CardDescription style={{ color: 'hsl(215 16% 47%)' }}>
            Copy this prompt and use it with ChatGPT or any AI tool to get the correct JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <pre className="text-sm whitespace-pre-wrap" style={{ color: 'hsl(215 16% 47%)' }}>
              Now give me this in a JSON format:
              {'\n\n'}
              {promptHelper}
            </pre>
          </div>
          <Button onClick={copyPrompt} variant="outline" className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Copy Prompt for AI
          </Button>
        </CardContent>
      </Card>

      {/* JSON Input */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" style={{ color: 'hsl(167 79% 39%)' }} />
            Paste Your Workout JSON
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your workout JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
          
          <Button 
            onClick={validateAndPreviewWorkout} 
            disabled={isValidating}
            className="w-full"
            variant="outline"
          >
            {isValidating ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview Workout
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card className="shadow-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Workout Preview</CardTitle>
            <CardDescription style={{ color: 'hsl(215 16% 47%)' }}>
              Review and edit your workout before saving
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Exercises ({exercises.length})</Label>
              <div className="mt-2 space-y-2">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-sm" style={{ color: 'hsl(215 16% 47%)' }}>
                      {exercise.sets} sets × {exercise.target_reps} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={saveWorkout}
              className="w-full bg-gradient-primary hover:opacity-90 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save & Start Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Zap, Target } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-gradient-hero">
          Turn AI Workouts into Reality
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: 'hsl(215 16% 47%)' }}>
          Import your AI-generated workout plans and track your progress with our simple, focused fitness tracker.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-gray-900">Import JSON</h3>
              <p className="text-sm text-gray-600">
                Paste your workout from ChatGPT or any AI tool
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-gray-900">Track Sets</h3>
              <p className="text-sm text-gray-600">
                Simple checkbox tracking with optional weight logging
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-gray-900">See Progress</h3>
              <p className="text-sm text-gray-600">
                View your workout history and improvement over time
              </p>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={onGetStarted} 
          variant="default" 
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-white"
        >
          <Upload className="mr-2 h-5 w-5" />
          Start Your First Workout
        </Button>
      </div>
    </section>
  );
};
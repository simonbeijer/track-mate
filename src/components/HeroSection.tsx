"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ListTodo, ListFilterPlus, BookOpenCheck } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Turn AI Workouts into <span className='text-gradient-hero'>
            Reality
            </span>
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: 'hsl(215 16% 47%)' }}>
          Add your own AI-generated workout plans into this simple app to create your tracker.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <ListFilterPlus className="h-12 w-12 iconColor mx-auto mb-4"/>
              <h3 className="font-semibold mb-2 text-gray-900">Add you workout</h3>
              <p className="text-sm text-gray-600">
                Paste your workout from AI chat in correct format
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <ListTodo className="h-12 w-12 iconColor mx-auto mb-4"/>
              <h3 className="font-semibold mb-2 text-gray-900">Create the tracker</h3>
              <p className="text-sm text-gray-600">
                Simple checkbox tracking with more options
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <BookOpenCheck className="h-12 w-12 iconColor mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-gray-900">See Progress</h3>
              <p className="text-sm text-gray-600">
                View your workout history and reuse you workouts
              </p>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={onGetStarted} 
          variant="default" 
          size="lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          Start Your First Workout
        </Button>
      </div>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[70vh]">
        <AnimatedTransition type="scale">
          <GlassmorphicCard className="max-w-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! We couldn't find that page.</p>
            <p className="text-muted-foreground mb-8">
              The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </Link>
            </Button>
          </GlassmorphicCard>
        </AnimatedTransition>
      </div>
    </Layout>
  );
};

export default NotFound;

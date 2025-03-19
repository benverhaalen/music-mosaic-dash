
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useSpotify } from '@/contexts/SpotifyContext';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SpotifyAuth from '@/components/SpotifyAuth';
import { ChevronRight, Music, ListMusic, BarChart3, Search } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading } = useSpotify();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedTransition type="fade" className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                Discover Music <span className="text-primary">Your Way</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 md:pr-12">
                Personalized music discoveries, custom playlists, and insights into your listening habits, all powered by Spotify.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <SpotifyAuth size="lg" />
                <Button variant="outline" className="group">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </AnimatedTransition>
            
            <AnimatedTransition type="scale" delay={200}>
              <div className="relative h-[400px] w-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-ping-slow"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl animate-ping-slow" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative h-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 transform rotate-6">
                    <GlassmorphicCard className="p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                      <img
                        src="https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"
                        alt="Channel Orange by Frank Ocean"
                        className="rounded-lg shadow-lg w-full h-auto"
                      />
                    </GlassmorphicCard>
                    <GlassmorphicCard className="p-4 transform rotate-3 hover:rotate-0 transition-transform">
                      <img
                        src="https://i.scdn.co/image/ab67616d0000b273b52795d86119cbaaff0a117a"
                        alt="After Hours by The Weeknd"
                        className="rounded-lg shadow-lg w-full h-auto"
                      />
                    </GlassmorphicCard>
                    <GlassmorphicCard className="p-4 transform rotate-6 hover:rotate-0 transition-transform">
                      <img
                        src="https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f"
                        alt="Dawn FM by The Weeknd"
                        className="rounded-lg shadow-lg w-full h-auto"
                      />
                    </GlassmorphicCard>
                    <GlassmorphicCard className="p-4 transform -rotate-6 hover:rotate-0 transition-transform">
                      <img
                        src="https://i.scdn.co/image/ab67616d0000b2734e1065ce95e1ddb321d10863"
                        alt="Blonde by Frank Ocean"
                        className="rounded-lg shadow-lg w-full h-auto"
                      />
                    </GlassmorphicCard>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 container mx-auto px-4 relative overflow-hidden">
        <div className="text-center mb-16">
          <AnimatedTransition type="fade" once>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Experience your music in a whole new way with our powerful features
            </p>
          </AnimatedTransition>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedTransition type="slide-up" delay={100} once>
            <GlassmorphicCard className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">
                Find any song instantly with our Spotify-powered search. Get real-time suggestions as you type.
              </p>
            </GlassmorphicCard>
          </AnimatedTransition>
          
          <AnimatedTransition type="slide-up" delay={200} once>
            <GlassmorphicCard className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                <ListMusic className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Playlist Management</h3>
              <p className="text-muted-foreground">
                Create and manage Spotify playlists with ease. Import your existing playlists and curate new ones.
              </p>
            </GlassmorphicCard>
          </AnimatedTransition>
          
          <AnimatedTransition type="slide-up" delay={300} once>
            <GlassmorphicCard className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Listening Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights into your music habits with detailed statistics about your top artists, tracks, and more.
              </p>
            </GlassmorphicCard>
          </AnimatedTransition>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <GlassmorphicCard className="max-w-4xl mx-auto p-12 text-center">
          <AnimatedTransition type="scale" once>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Music Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Connect your Spotify account and unlock a new world of musical discovery and personalization.
            </p>
            <SpotifyAuth size="lg" />
          </AnimatedTransition>
        </GlassmorphicCard>
      </section>
    </Layout>
  );
};

export default Index;

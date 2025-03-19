
import React, { useState, useEffect } from 'react';
import { useSpotify } from '@/contexts/SpotifyContext';
import { getTopTracks, getTopArtists } from '@/lib/spotify';
import { useToast } from '@/components/ui/use-toast';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { Music, User, Clock, BarChart, ChevronRight, Star } from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard = ({ className = '' }: AnalyticsDashboardProps) => {
  const { isAuthenticated, tokens } = useSpotify();
  const { toast } = useToast();
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  
  // Mock data for total minutes (in a real app, this would come from the API)
  const totalMinutes = 4862;
  
  // Fetch user's top tracks and artists
  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken) return;
    
    const fetchTopItems = async () => {
      // Fetch top tracks
      setIsLoadingTracks(true);
      try {
        const tracks = await getTopTracks(tokens.accessToken, 'short_term', 5);
        setTopTracks(tracks);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        toast({
          title: 'Failed to load top tracks',
          description: 'There was an error loading your top tracks.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingTracks(false);
      }
      
      // Fetch top artists
      setIsLoadingArtists(true);
      try {
        const artists = await getTopArtists(tokens.accessToken, 'short_term', 5);
        setTopArtists(artists);
      } catch (error) {
        console.error('Error fetching top artists:', error);
        toast({
          title: 'Failed to load top artists',
          description: 'There was an error loading your top artists.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingArtists(false);
      }
    };
    
    fetchTopItems();
  }, [isAuthenticated, tokens?.accessToken, toast]);
  
  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  if (!isAuthenticated) {
    return (
      <GlassmorphicCard className={`p-8 text-center ${className}`}>
        <h4 className="text-xl font-semibold mb-2">Authentication Required</h4>
        <p className="text-muted-foreground mb-4">
          Please log in with your Spotify account to view your listening statistics.
        </p>
      </GlassmorphicCard>
    );
  }
  
  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">Your Listening Stats</h3>
        <p className="text-muted-foreground">Insights into your music taste for the past month</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnimatedTransition type="slide-up" delay={100}>
          <GlassmorphicCard className="p-5 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/20 p-4 mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Total Listening Time (YTD)</p>
            <h4 className="text-3xl font-bold">{formatMinutes(totalMinutes)}</h4>
            <p className="text-sm text-muted-foreground mt-2">
              That's about {Math.round(totalMinutes / 60 / 24 * 10) / 10} days of music!
            </p>
          </GlassmorphicCard>
        </AnimatedTransition>
        
        <AnimatedTransition type="slide-up" delay={200}>
          <GlassmorphicCard className="p-5 flex flex-col items-center text-center">
            <div className="rounded-full bg-accent/20 p-4 mb-4">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Top Artist</p>
            <h4 className="text-2xl font-bold">
              {isLoadingArtists ? (
                <span className="inline-block w-32 h-8 bg-muted animate-pulse rounded"></span>
              ) : topArtists.length > 0 ? (
                topArtists[0].name
              ) : (
                'No data available'
              )}
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              {isLoadingArtists ? (
                <span className="inline-block w-24 h-4 bg-muted animate-pulse rounded"></span>
              ) : topArtists.length > 0 ? (
                `${topArtists[0].followers.total.toLocaleString()} followers`
              ) : (
                ''
              )}
            </p>
          </GlassmorphicCard>
        </AnimatedTransition>
        
        <AnimatedTransition type="slide-up" delay={300}>
          <GlassmorphicCard className="p-5 flex flex-col items-center text-center">
            <div className="rounded-full bg-secondary/20 p-4 mb-4">
              <Music className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Top Track</p>
            <h4 className="text-2xl font-bold">
              {isLoadingTracks ? (
                <span className="inline-block w-32 h-8 bg-muted animate-pulse rounded"></span>
              ) : topTracks.length > 0 ? (
                topTracks[0].name
              ) : (
                'No data available'
              )}
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              {isLoadingTracks ? (
                <span className="inline-block w-24 h-4 bg-muted animate-pulse rounded"></span>
              ) : topTracks.length > 0 ? (
                topTracks[0].artists.map((a: any) => a.name).join(', ')
              ) : (
                ''
              )}
            </p>
          </GlassmorphicCard>
        </AnimatedTransition>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedTransition type="scale" delay={150}>
          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg">Top 5 Artists</h4>
              <BarChart className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {isLoadingArtists ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="rounded-full w-12 h-12 bg-muted animate-pulse mr-3"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-muted animate-pulse rounded w-32 mb-1"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topArtists.length > 0 ? (
              <div className="space-y-4">
                {topArtists.map((artist, index) => (
                  <div key={artist.id} className="flex items-center">
                    <div className="font-bold text-lg w-6 text-muted-foreground mr-3">
                      {index + 1}
                    </div>
                    {artist.images[0] ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium">{artist.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {artist.genres.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No top artists data available
              </div>
            )}
          </GlassmorphicCard>
        </AnimatedTransition>
        
        <AnimatedTransition type="scale" delay={300}>
          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg">Top 5 Tracks</h4>
              <Music className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {isLoadingTracks ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="rounded w-12 h-12 bg-muted animate-pulse mr-3"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-muted animate-pulse rounded w-32 mb-1"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topTracks.length > 0 ? (
              <div className="space-y-4">
                {topTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center">
                    <div className="font-bold text-lg w-6 text-muted-foreground mr-3">
                      {index + 1}
                    </div>
                    {track.album.images[0] ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        className="w-12 h-12 rounded object-cover shadow-sm mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center mr-4">
                        <Music className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h5 className="font-medium truncate">{track.name}</h5>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artists.map((a: any) => a.name).join(', ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No top tracks data available
              </div>
            )}
          </GlassmorphicCard>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

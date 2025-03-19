
import React, { useState, useEffect } from 'react';
import { useSpotify } from '@/contexts/SpotifyContext';
import { getRecommendations, categorizeTracksByPopularity } from '@/lib/spotify';
import { useToast } from '@/components/ui/use-toast';
import { Music, Plus, Clock, Award, Star, Sparkles, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const popularityIcons = {
  'Trending Hit': <Award className="w-4 h-4" />,
  'Popular Pick': <Star className="w-4 h-4" />,
  'Solid Track': <Music className="w-4 h-4" />,
  'Hidden Gem': <Sparkles className="w-4 h-4" />,
  'Deep Cut': <Headphones className="w-4 h-4" />,
  'Additional Recommendation': <Music className="w-4 h-4" />,
};

interface SongRecommendationsProps {
  seedTrack: any;
  onAddToPlaylist?: (track: any) => void;
  className?: string;
}

const SongRecommendations = ({
  seedTrack,
  onAddToPlaylist,
  className = '',
}: SongRecommendationsProps) => {
  const { tokens } = useSpotify();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!seedTrack || !tokens?.accessToken) return;
    
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const tracks = await getRecommendations(seedTrack.id, tokens.accessToken, 20);
        const categorizedTracks = categorizeTracksByPopularity(tracks);
        setRecommendations(categorizedTracks);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: 'Recommendations failed',
          description: 'Could not load song recommendations.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [seedTrack, tokens?.accessToken, toast]);
  
  const handleAddToPlaylist = (track: any) => {
    if (onAddToPlaylist) {
      onAddToPlaylist(track);
      toast({
        title: 'Added to playlist',
        description: `Added "${track.name}" to your playlist`,
      });
    }
  };
  
  // Format track duration from milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  
  if (!seedTrack) return null;
  
  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">Similar Songs</h3>
        <p className="text-muted-foreground">Based on "{seedTrack.name}" by {seedTrack.artists[0].name}</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="music-waves">
            <div className="music-wave"></div>
            <div className="music-wave"></div>
            <div className="music-wave"></div>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((track, index) => (
            <AnimatedTransition key={track.id} type="scale" delay={index * 100}>
              <GlassmorphicCard className="p-5 flex flex-col h-full hover-scale">
                <div className="flex items-start mb-4">
                  {track.album.images[0] ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="w-16 h-16 rounded-lg object-cover shadow-md blur-loading mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mr-4">
                      <Music className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-lg line-clamp-1">{track.name}</h4>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                      {track.artists.map((artist: any) => artist.name).join(', ')}
                    </p>
                    <div className="flex items-center">
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {popularityIcons[track.popularityTier as keyof typeof popularityIcons]}
                        <span className="ml-1">{track.popularityTier}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDuration(track.duration_ms)}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAddToPlaylist(track)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </GlassmorphicCard>
            </AnimatedTransition>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recommendations found</p>
        </div>
      )}
    </div>
  );
};

export default SongRecommendations;

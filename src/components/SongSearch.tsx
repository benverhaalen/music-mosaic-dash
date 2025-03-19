
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSpotify } from '@/contexts/SpotifyContext';
import { searchTracks } from '@/lib/spotify';
import { Search, X, Music } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

interface SongSearchProps {
  onSelectTrack?: (track: any) => void;
  className?: string;
}

const SongSearch = ({ onSelectTrack, className = '' }: SongSearchProps) => {
  const { tokens } = useSpotify();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search with debounce
  useEffect(() => {
    if (!tokens?.accessToken) return;
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setIsSearching(true);
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchTracks(query, tokens.accessToken, 5);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: 'Search failed',
          description: 'There was an error searching for tracks.',
          variant: 'destructive',
        });
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, tokens?.accessToken, toast]);
  
  const handleSelectTrack = (track: any) => {
    if (onSelectTrack) {
      onSelectTrack(track);
      setShowResults(false);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs..."
          className="pl-10 pr-10 h-12 text-base border-2 transition-all focus-visible:ring-accent"
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {showResults && (
        <AnimatedTransition
          type="fade"
          className="absolute mt-1 w-full z-20"
        >
          <GlassmorphicCard className="p-2 max-h-[300px] overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center items-center py-4">
                <div className="music-waves">
                  <div className="music-wave"></div>
                  <div className="music-wave"></div>
                  <div className="music-wave"></div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((track) => (
                  <li key={track.id}>
                    <button
                      onClick={() => handleSelectTrack(track)}
                      className="w-full text-left flex items-center p-2 rounded-md hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-shrink-0 mr-3">
                        {track.album.images[0] ? (
                          <img
                            src={track.album.images[0].url}
                            alt={track.album.name}
                            className="w-10 h-10 rounded object-cover blur-loading"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Music className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.artists.map((artist: any) => artist.name).join(', ')}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-3">
                No results found
              </p>
            )}
          </GlassmorphicCard>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default SongSearch;

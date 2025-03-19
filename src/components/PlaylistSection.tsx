
import React, { useState, useEffect } from 'react';
import { useSpotify } from '@/contexts/SpotifyContext';
import { getUserPlaylists, createPlaylist, addTracksToPlaylist } from '@/lib/spotify';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import { PlusCircle, FolderPlus, Music, Trash, X, Edit, Check, ExternalLink } from 'lucide-react';

interface PlaylistSectionProps {
  className?: string;
}

const PlaylistSection = ({ className = '' }: PlaylistSectionProps) => {
  const { isAuthenticated, tokens, user } = useSpotify();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState<any[]>([]);
  
  // Fetch user's playlists
  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken) return;
    
    const fetchPlaylists = async () => {
      setIsLoading(true);
      try {
        const userPlaylists = await getUserPlaylists(tokens.accessToken);
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        toast({
          title: 'Failed to load playlists',
          description: 'There was an error loading your Spotify playlists.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaylists();
  }, [isAuthenticated, tokens?.accessToken, toast]);
  
  const handleCreatePlaylist = async () => {
    if (!isAuthenticated || !tokens?.accessToken || !user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create playlists.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newPlaylistName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your playlist.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const newPlaylist = await createPlaylist(
        user.id,
        tokens.accessToken,
        newPlaylistName,
        'Created with Music Mosaic',
        false
      );
      
      setPlaylists([newPlaylist, ...playlists]);
      setNewPlaylistName('');
      setSelectedPlaylist(newPlaylist);
      setCurrentPlaylistTracks([]);
      
      toast({
        title: 'Playlist created',
        description: `"${newPlaylistName}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: 'Failed to create playlist',
        description: 'There was an error creating your playlist.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const addTrackToPlaylist = async (track: any) => {
    if (!selectedPlaylist) {
      toast({
        title: 'No playlist selected',
        description: 'Please select or create a playlist first.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await addTracksToPlaylist(
        selectedPlaylist.id,
        tokens!.accessToken,
        [track.uri]
      );
      
      setCurrentPlaylistTracks([...currentPlaylistTracks, track]);
      
      toast({
        title: 'Track added',
        description: `"${track.name}" added to "${selectedPlaylist.name}".`,
      });
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      toast({
        title: 'Failed to add track',
        description: 'There was an error adding the track to your playlist.',
        variant: 'destructive',
      });
    }
  };
  
  const removeTrackFromPlaylist = (trackIndex: number) => {
    // In a real implementation, this would call the Spotify API to remove the track
    // For now, we'll just update the local state
    const newTracks = [...currentPlaylistTracks];
    newTracks.splice(trackIndex, 1);
    setCurrentPlaylistTracks(newTracks);
    
    toast({
      title: 'Track removed',
      description: 'The track was removed from your playlist.',
    });
  };
  
  const generateCoverArt = (tracks: any[]) => {
    // This function would generate a dynamic cover art based on the tracks
    // For now, we just return the first track's album art or a default icon
    if (tracks.length > 0 && tracks[0].album.images[0]) {
      return tracks[0].album.images[0].url;
    }
    return null;
  };
  
  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">Your Playlists</h3>
        <p className="text-muted-foreground">Create and manage your Spotify playlists</p>
      </div>
      
      {isAuthenticated ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GlassmorphicCard className="p-5">
              <h4 className="font-semibold text-lg mb-4">Create Playlist</h4>
              <div className="space-y-3">
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="border-2"
                />
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={isCreating || !newPlaylistName.trim()}
                  className="w-full gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Playlist</span>
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <h4 className="font-semibold text-lg mb-4">Your Playlists</h4>
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="music-waves">
                    <div className="music-wave"></div>
                    <div className="music-wave"></div>
                    <div className="music-wave"></div>
                  </div>
                </div>
              ) : playlists.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        // In a real implementation, we would fetch the tracks for this playlist
                        setCurrentPlaylistTracks([]);
                      }}
                      className={`w-full flex items-center p-2 rounded-md transition-colors ${
                        selectedPlaylist?.id === playlist.id
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-white/30 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {playlist.images[0] ? (
                          <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Music className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="font-medium truncate">{playlist.name}</p>
                        <p className="text-xs opacity-70 truncate">
                          {playlist.tracks.total} tracks
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No playlists found
                </div>
              )}
            </GlassmorphicCard>
          </div>
          
          <div className="lg:col-span-2">
            {selectedPlaylist ? (
              <GlassmorphicCard className="p-5 h-full">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 mr-4">
                    {generateCoverArt(currentPlaylistTracks) ? (
                      <img
                        src={generateCoverArt(currentPlaylistTracks)}
                        alt={selectedPlaylist.name}
                        className="w-24 h-24 rounded-lg object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                        <FolderPlus className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{selectedPlaylist.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {currentPlaylistTracks.length} tracks in this playlist
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in Spotify</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Tracks</h4>
                    {currentPlaylistTracks.length > 0 && (
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Check className="w-4 h-4" />
                        <span>Save to Spotify</span>
                      </Button>
                    )}
                  </div>
                  
                  {currentPlaylistTracks.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {currentPlaylistTracks.map((track, index) => (
                        <AnimatedTransition
                          key={`${track.id}-${index}`}
                          type="fade"
                          className="flex items-center p-3 rounded-md bg-white/30 dark:bg-white/10"
                        >
                          <div className="flex-shrink-0 mr-3">
                            {track.album.images[0] ? (
                              <img
                                src={track.album.images[0].url}
                                alt={track.album.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <Music className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium truncate">{track.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {track.artists.map((artist: any) => artist.name).join(', ')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeTrackFromPlaylist(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AnimatedTransition>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                      <p>No tracks in this playlist</p>
                      <p className="text-sm mt-1">Search for songs and add them to your playlist</p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            ) : (
              <GlassmorphicCard className="p-6 h-full flex flex-col items-center justify-center text-center">
                <FolderPlus className="w-16 h-16 text-muted-foreground mb-4" />
                <h4 className="text-xl font-semibold mb-2">No Playlist Selected</h4>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Select an existing playlist from the list or create a new one to get started.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Focus the input field for new playlist name
                    document.querySelector('input')?.focus();
                  }}
                >
                  Create Your First Playlist
                </Button>
              </GlassmorphicCard>
            )}
          </div>
        </div>
      ) : (
        <GlassmorphicCard className="p-8 text-center">
          <h4 className="text-xl font-semibold mb-2">Authentication Required</h4>
          <p className="text-muted-foreground mb-4">
            Please log in with your Spotify account to manage playlists.
          </p>
        </GlassmorphicCard>
      )}
    </div>
  );
};

export default PlaylistSection;


/**
 * Utility functions for interacting with the Spotify Web API
 */

// Base URL for Spotify API calls
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Search for tracks
export const searchTracks = async (query: string, accessToken: string, limit = 5) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to search tracks');
    
    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

// Get recommendations based on seed tracks
export const getRecommendations = async (
  seedTrackId: string,
  accessToken: string,
  limit = 5
) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/recommendations?seed_tracks=${seedTrackId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to get recommendations');
    
    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Get user's top tracks
export const getTopTracks = async (accessToken: string, timeRange = 'short_term', limit = 5) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to get top tracks');
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error getting top tracks:', error);
    return [];
  }
};

// Get user's top artists
export const getTopArtists = async (accessToken: string, timeRange = 'short_term', limit = 5) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to get top artists');
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error getting top artists:', error);
    return [];
  }
};

// Get user's playlists
export const getUserPlaylists = async (accessToken: string, limit = 20) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/playlists?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to get user playlists');
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error getting user playlists:', error);
    return [];
  }
};

// Create a new playlist
export const createPlaylist = async (
  userId: string,
  accessToken: string,
  name: string,
  description = '',
  isPublic = false
) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          public: isPublic,
        }),
      }
    );
    
    if (!response.ok) throw new Error('Failed to create playlist');
    
    return await response.json();
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// Add tracks to a playlist
export const addTracksToPlaylist = async (
  playlistId: string,
  accessToken: string,
  trackUris: string[]
) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );
    
    if (!response.ok) throw new Error('Failed to add tracks to playlist');
    
    return await response.json();
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    throw error;
  }
};

// Categorize tracks based on popularity
export const categorizeTracksByPopularity = (tracks: any[]) => {
  if (!tracks || tracks.length === 0) return [];
  
  // Sort tracks by popularity (0-100, higher is more popular)
  const sortedTracks = [...tracks].sort((a, b) => b.popularity - a.popularity);
  
  // Select tracks from different popularity ranges
  const result = [];
  
  // Get the most popular track
  if (sortedTracks.length > 0) {
    result.push({
      ...sortedTracks[0],
      popularityTier: 'Trending Hit',
    });
  }
  
  // Get a track from the middle-high range (60-80% popularity)
  const highMidIndex = sortedTracks.findIndex(track => 
    track.popularity < 80 && track.popularity >= 60);
  if (highMidIndex !== -1) {
    result.push({
      ...sortedTracks[highMidIndex],
      popularityTier: 'Popular Pick',
    });
  }
  
  // Get a track from the middle range (40-60% popularity)
  const midIndex = sortedTracks.findIndex(track => 
    track.popularity < 60 && track.popularity >= 40);
  if (midIndex !== -1) {
    result.push({
      ...sortedTracks[midIndex],
      popularityTier: 'Solid Track',
    });
  }
  
  // Get a track from the middle-low range (20-40% popularity)
  const lowMidIndex = sortedTracks.findIndex(track => 
    track.popularity < 40 && track.popularity >= 20);
  if (lowMidIndex !== -1) {
    result.push({
      ...sortedTracks[lowMidIndex],
      popularityTier: 'Hidden Gem',
    });
  }
  
  // Get the least popular track (below 20% popularity)
  const lowIndex = sortedTracks.findIndex(track => track.popularity < 20);
  if (lowIndex !== -1) {
    result.push({
      ...sortedTracks[lowIndex],
      popularityTier: 'Deep Cut',
    });
  }
  
  // If we don't have 5 tracks yet, fill with remaining tracks
  if (result.length < 5 && sortedTracks.length > result.length) {
    // Find tracks that aren't already in our result
    const remainingTracks = sortedTracks.filter(
      track => !result.some(t => t.id === track.id)
    );
    
    // Add remaining tracks until we have 5 or run out
    for (let i = 0; i < remainingTracks.length && result.length < 5; i++) {
      result.push({
        ...remainingTracks[i],
        popularityTier: 'Additional Recommendation',
      });
    }
  }
  
  return result;
};

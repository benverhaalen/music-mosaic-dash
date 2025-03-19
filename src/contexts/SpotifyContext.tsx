
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define types for Spotify auth and tokens
type SpotifyTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

type SpotifyUser = {
  id: string;
  displayName: string;
  imageUrl?: string;
};

type SpotifyContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SpotifyUser | null;
  login: () => void;
  logout: () => void;
  tokens: SpotifyTokens | null;
};

// Create context with default values
const SpotifyContext = createContext<SpotifyContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
  tokens: null,
});

// Custom hook for easy context usage
export const useSpotify = () => useContext(SpotifyContext);

// Provider component
export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);

  // Check for stored tokens on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('spotify_tokens');
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens) as SpotifyTokens;
        
        // Check if tokens are still valid
        if (parsedTokens.expiresAt > Date.now()) {
          setTokens(parsedTokens);
          setIsAuthenticated(true);
          fetchUserProfile(parsedTokens.accessToken);
        } else {
          // Handle expired tokens (would normally use refresh token here)
          localStorage.removeItem('spotify_tokens');
        }
      } catch (error) {
        console.error('Failed to parse stored tokens:', error);
        localStorage.removeItem('spotify_tokens');
      }
    }
    
    // Also check if we're returning from Spotify auth
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');
    
    if (accessToken && tokenType && expiresIn) {
      // We've returned from Spotify auth with tokens
      const newTokens: SpotifyTokens = {
        accessToken,
        refreshToken: '', // In actual implementation, you'd get this from the backend
        expiresAt: Date.now() + parseInt(expiresIn) * 1000,
      };
      
      // Store tokens and update state
      localStorage.setItem('spotify_tokens', JSON.stringify(newTokens));
      setTokens(newTokens);
      setIsAuthenticated(true);
      
      // Remove hash from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Fetch user profile
      fetchUserProfile(accessToken);
    }
    
    setIsLoading(false);
  }, []);

  // Fetch user profile from Spotify API
  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          displayName: userData.display_name,
          imageUrl: userData.images?.[0]?.url,
        });
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we can't fetch the profile, we're not really authenticated
      setIsAuthenticated(false);
      localStorage.removeItem('spotify_tokens');
      setTokens(null);
    }
  };

  // In a real app, we'd call our backend to start the OAuth flow
  const login = () => {
    // For demo purposes, we'll use the implicit grant flow directly
    // In production, you'd use authorization code flow via your backend
    const client_id = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with actual client ID
    const redirect_uri = encodeURIComponent(window.location.origin);
    const scopes = encodeURIComponent('user-read-private user-read-email user-top-read playlist-read-private playlist-modify-private playlist-modify-public');
    
    const spotifyAuthUrl = 
      `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scopes}&show_dialog=true`;
    
    window.location.href = spotifyAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem('spotify_tokens');
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        tokens,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { useSpotify } from '@/contexts/SpotifyContext';
import { Music } from 'lucide-react';

interface SpotifyAuthProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const SpotifyAuth = ({ 
  className = '',
  variant = 'default',
  size = 'default'
}: SpotifyAuthProps) => {
  const { isAuthenticated, login, logout, user } = useSpotify();

  return (
    <div className={className}>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.displayName}
              className="w-8 h-8 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-md">
              <span className="text-xs font-bold">
                {user?.displayName?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.displayName}</span>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={login}
          variant={variant}
          size={size}
          className="relative overflow-hidden button-shine rounded-full bg-white/20 backdrop-blur-md shadow-button dark:bg-gray-800/30 hover:bg-white/30 dark:hover:bg-gray-800/40"
        >
          <Music className="w-4 h-4 mr-2" />
          Connect with Spotify
        </Button>
      )}
    </div>
  );
};

export default SpotifyAuth;

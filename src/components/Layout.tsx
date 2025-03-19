
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SpotifyAuth from '@/components/SpotifyAuth';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  ListMusic,
  BarChart3,
  Menu,
  X,
  Music,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
    { name: 'Stats', path: '/stats', icon: BarChart3 },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="min-h-screen flex flex-col animated-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-full p-1.5">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">MusicMosaic</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive(item.path) && 'active'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:block">
            <SpotifyAuth />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/90 backdrop-blur-lg pt-16 md:hidden">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <SpotifyAuth className="mb-8" />
            
            <nav className="flex flex-col items-center space-y-6 w-full">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'flex items-center text-lg font-medium py-2',
                    isActive(item.path) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MusicMosaic — Discover your music in a whole new way.</p>
          <p className="mt-2">Powered by Spotify. Not affiliated with Spotify AB.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
